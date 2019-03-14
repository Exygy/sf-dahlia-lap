# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ShortFormController, type: :controller do
  login_admin

  listing_id = 'a0W0P00000GbyuQ' # LAP Test Listing - Yellow Acres

  describe '#submit' do
    describe 'without a lease' do
      it 'receives a successful response from Salesforce' do
        VCR.use_cassette('api/v1/short-form/submit/without-lease') do
          params = {
            application: {
              applicationSubmissionType: 'Paper',
              applicationSubmittedDate: '2019-03-12',
              status: 'Submitted',
              listingID: listing_id,
              annualIncome: 110_000,
              applicationLanguage: 'English',
              primaryApplicant: {
                firstName: 'Test',
                lastName: 'Supp app test',
                email: 'eee@eeee.com',
                DOB: '1950-01-01',
                address: '123 MAIN ST',
                city: 'SAN FRANCISCO',
                state: 'CA',
                zip: '94105-1804',
              },
              householdMembers: [
                {
                  firstName: 'member',
                  lastName: 'test',
                  DOB: '1976-06-11',
                },
              ],
              shortFormPreferences: [],
            },
          }
          post :submit, params: params
        end
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['application']).not_to be_empty
      end
    end
    describe 'with a lease' do
      it 'creates a new lease if no lease exists on the application' do
        # We can ensure that there's no lease on the app if it's a new application
        VCR.use_cassette('api/v1/short-form/submit/with-new-lease') do
          params = {
            application: {
              applicationSubmissionType: 'Paper',
              applicationSubmittedDate: '2019-03-12',
              status: 'Submitted',
              listingID: listing_id,
              annualIncome: 110_000,
              applicationLanguage: 'English',
              primaryApplicant: {
                firstName: 'Test',
                lastName: 'Supp app test',
                email: 'eee@eeee.com',
                DOB: '1950-01-01',
                address: '123 MAIN ST',
                city: 'SAN FRANCISCO',
                state: 'CA',
                zip: '94105-1804',
              },
              householdMembers: [
                {
                  firstName: 'member',
                  lastName: 'test',
                  DOB: '1976-06-11',
                },
              ],
              shortFormPreferences: [],
              lease: {
                total_monthly_rent_without_parking: 200,
              },
            },
          }
          post :submit, params: params
        end
        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        # FIXME: Move lease to its own controller, then test that response is correct
        expect(json['application']).not_to be_empty
      end
    end
  end
end