# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Force::Soql::PreferenceService do
  LEASE_UP_LISTING_ID = 'a0W0P00000GbyuQUAR' # Yellow Acres test listing

  let(:user) { User.create(email: 'admin@example.com', admin: false) }
  subject { Force::Soql::PreferenceService.new(user) }

  describe 'buildAppPreferencesFilters' do
    it 'should create the correct accessibility string for Mobility' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ listing_id: LEASE_UP_LISTING_ID, accessibility: 'Mobility impairments' })

        expect(filters).to include("INCLUDES ('Mobility impairments')")
      end
    end

    it 'should create the correct accessibility string Vision/Hearing' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ listing_id: LEASE_UP_LISTING_ID, accessibility: 'Vision impairments, Hearing impairments' })

        expect(filters).to include("INCLUDES ('Vision impairments', 'Hearing impairments')")
      end
    end

    it 'creates the expected query string when householdmembers is set to 1' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ total_household_size: '1' })

        expect(filters).to include("and Application__r.Total_Household_Size__c = 1")
      end
    end

    it 'creates the expected query string when householdmembers is set to 5+' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesFilters({ total_household_size: '5+' })

        expect(filters).to include("and Application__r.Total_Household_Size__c >= 5")
      end
    end
  end

  describe 'buildAppPreferencesSearch' do
    it 'creates the expected query string for a single search term' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesSearch('searchString')
        expected_filters = [
          "(",
          "Application__r.Name like '%searchString%' OR ",
          "Application__r.Applicant__r.First_Name__c like '%searchString%' OR ",
          "Application__r.Applicant__r.Last_Name__c like '%searchString%'",
          ")"
        ].join('')
        expect(filters). to eq(expected_filters)
      end
    end
    it 'creates the expected query string for multiple search terms' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesSearch('string1,string2')
        expected_filters = [
          "(",
          "Application__r.Name like '%string1%' OR ",
          "Application__r.Applicant__r.First_Name__c like '%string1%' OR ",
          "Application__r.Applicant__r.Last_Name__c like '%string1%'",
          ") AND (",
          "Application__r.Name like '%string2%' OR ",
          "Application__r.Applicant__r.First_Name__c like '%string2%' OR ",
          "Application__r.Applicant__r.Last_Name__c like '%string2%'",
          ")"
        ].join('')
        expect(filters). to eq(expected_filters)
      end
    end
    it 'sanitizes search terms' do
      VCR.use_cassette('services/soql/preference_service') do
        filters = subject.buildAppPreferencesSearch('%"_something')
        expected_filters = [
          "(",
          "Application__r.Name like '%\\%\"\\_something%' OR ",
          "Application__r.Applicant__r.First_Name__c like '%\\%\"\\_something%' OR ",
          "Application__r.Applicant__r.Last_Name__c like '%\\%\"\\_something%'",
          ")"
        ].join('')
        expect(filters). to eq(expected_filters)
      end
    end
  end
end
