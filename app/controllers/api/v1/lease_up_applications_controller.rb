# frozen_string_literal: true

module Api::V1
  # Lease Up Applications controller for access via the API
  class LeaseUpApplicationsController < ApiController
    def index
      applications = soql_preference_service.app_preferences_for_listing(lease_up_apps_params)
      application_ids = applications[:records].map { |data| "'#{data[:Application]['Id']}'" }

      applications[:records] = Force::Preference.convert_list(applications[:records], :from_salesforce, :to_domain)

      # find the last time the status was updated on these applications,
      # i.e. what is the most recently-dated Field Update Comment, if
      # any, for each application
      if application_ids.present?
        status_last_updated_dates = application_status_service.last_updated_dates(application_ids)
        set_status_last_updated(status_last_updated_dates, applications.records)
      end

      render json: applications
    end

    private

    def soql_preference_service
      Force::Soql::PreferenceService.new(current_user)
    end

    def application_status_service
      Force::Soql::ApplicationStatusService.new(current_user)
    end

    def set_status_last_updated(status_last_updated_dates, applications)
      status_last_updated_dates.each do |status_date|
        applications.each do |app_data|
          application_id = app_data[:application] ? app_data[:application][:id] : app_data[:id]
          if application_id == status_date[:Application]
            app_data[:application][:status_last_updated] = status_date[:Status_Last_Updated] if app_data[:application]
            app_data[:status_last_updated] = status_date[:Status_Last_Updated] if app_data[:application].nil?
          end
        end
      end
    end

    def lease_up_apps_params
      params.permit(:search, :listing_id, :page, :preference, :status, :accessibility, :total_household_size)
    end
  end
end
