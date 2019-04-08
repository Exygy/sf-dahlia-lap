import React from 'react'
import { mount } from 'enzyme'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'

const mockfetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

const tick = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

jest.mock('apiService', () => {
  return {
    fetchLeaseUpApplications: async (data) => {
      mockfetchLeaseUpApplications(data)
      return Promise.resolve({'records': mockApplications})
    },
    createFieldUpdateComment: async (data) => {
      var response = mockCreateFieldUpdateComment(data)
      return Promise.resolve(response)
    }
  }
})

const buildMockApplicationWithPreference = (uniqId, prefOrder, prefRank) => {
  return {
    'Id': uniqId,
    'Processing_Status': 'processing',
    'Preference_Order': prefOrder,
    'Preference_Lottery_Rank': prefRank,
    'Listing_Preference_ID': {
      'Record_Type_For_App_Preferences': 'COP'
    },
    'Application': {
      'Id': 1000 + uniqId,
      'Name': `Application Name ${uniqId}`,
      'Status_Last_Updated': '2018-04-26T12:31:39.000+0000',
      'Applicant': {
        'Id': '1',
        'Residence_Address': `1316 BURNETT ${uniqId}`,
        'First_Name': `some first name ${uniqId}`,
        'Last_Name': `some last name ${uniqId}`,
        'Phone': 'some phone',
        'Email': `some email ${uniqId}`
      }
    }
  }
}

let mockApplications = [
  buildMockApplicationWithPreference(1, '2', '2'),
  buildMockApplicationWithPreference(2, '2', '1'),
  buildMockApplicationWithPreference(3, '3', '1'),
  buildMockApplicationWithPreference(4, '1', '2'),
  buildMockApplicationWithPreference(5, '1', '1')
]

const listing = {
  Id: 'listingId',
  Name: 'listingName',
  Building_Street_Address: 'buildingAddress',
  Report_id: 'REPORT_ID'
}

const openStatusModal = (wrapper) => {
  expect(wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').exists()).toBeTruthy()
  wrapper.find('div.rt-tbody .rt-tr-group').first().find('button').simulate('click')
  wrapper.find('li.dropdown-menu_item.is-appealed > a').simulate('click')
  return wrapper
}

let wrapper

describe('LeaseUpApplicationsPage', () => {
  beforeEach(async () => {
    wrapper = await mount(
      <LeaseUpApplicationsPage listing={listing} />
    )
    await tick()
    wrapper.update()
  })
  test('Should render LeaseUpTable', async () => {
    expect(wrapper).toMatchSnapshot()
  })
  test('Should render address when present', async () => {
    expect(wrapper.find('div.rt-tbody .rt-tr-group').first().text()).toContain('1316 BURNETT')
  })

  describe('StatusModal', () => {
    const openModalSelector = '.ReactModal__Content--after-open'
    const commentBoxSelector = 'textarea#status-comment'
    const updateButtonSelector = 'div.modal-button_item.modal-button_primary > button'

    test('Can be opened and closed', async () => {
      openStatusModal(wrapper)

      // Expect the modal to be open
      expect(wrapper.find(openModalSelector).exists()).toBeTruthy()

      // Click the close button
      wrapper.find('.close-reveal-modal').simulate('click')

      // Expect the modal to be closed
      expect(wrapper.find(openModalSelector).exists()).toBe(false)
    })
    test('Should call createFieldUpdateComment and close on successful submit', async () => {
      mockCreateFieldUpdateComment.mockReturnValueOnce(true)
      openStatusModal(wrapper)

      // Fill out the comment form and submit
      wrapper.find(commentBoxSelector).simulate('change', {target: {value: 'Sample comment value'}})
      wrapper.find(updateButtonSelector).simulate('submit')
      await tick()
      wrapper.update()

      // Expect createFieldUpdateComment was called and modal is closed
      expect(mockCreateFieldUpdateComment.mock.calls.length).toBe(1)
      expect(wrapper.find(openModalSelector).exists()).toBe(false)
    })

    test('Should open closeable alert modal on failed submit', async () => {
      mockCreateFieldUpdateComment.mockReturnValueOnce(false)
      openStatusModal(wrapper)

      // Fill out the comment and submit
      wrapper.find(commentBoxSelector).simulate('change', {target: {value: 'Sample comment value'}})
      wrapper.find(updateButtonSelector).simulate('submit')
      await tick()
      wrapper.update()

      // Expect alert message to be present
      expect(wrapper.find('.alert-body').exists()).toBeTruthy()

      // Close the alert message
      wrapper.find('.alert-box-and-notice button.close').simulate('click')

      // Expect alert to be closed
      expect(wrapper.find('.alert-body').exists()).toBe(false)
    })
  })
})