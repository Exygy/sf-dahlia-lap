# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::LeasesController, type: :controller do
  login_admin

  application_with_lease = 'a0o210000027w7EAAQ' # All Preferences
  test_lease_id = 'a1321000000qBsrAAE' # Lease id for application_with_lease
  application_without_lease = 'a0o0P00000IvkTqQAJ' # Tristan Maleah - Lease needs to be deleted if VCR re-taped
  lease_id_length = 18
  describe '#create' do
    it 'updates existing lease if application has lease' do
      VCR.use_cassette('api/v1/leases/create/app-with-lease') do
        params = {
          application_id: application_with_lease,
          lease: {
            'monthly_parking_rent': 100,
          },
        }
        post :create, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease']).to eq(true) # update returns true
    end
    it 'creates a new lease if application doesn\'t have lease' do
      VCR.use_cassette('api/v1/leases/create/app-without-lease') do
        params = {
          application_id: application_without_lease,
          lease: {
            'monthly_parking_rent': 100,
          },
        }
        post :create, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease'].size).to eq(lease_id_length) # create returns lease id
    end
  end

  describe '#update' do
    it 'updates a lease successfully' do
      VCR.use_cassette('api/v1/leases/update/app-with-lease') do
        params = {
          id: application_with_lease,
          application_id: application_with_lease,
          lease: {
            'id': test_lease_id,
            'monthly_parking_rent': 100,
          },
        }
        put :update, params: params
      end
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['lease']).to eq(true) # update returns true
    end
  end
end