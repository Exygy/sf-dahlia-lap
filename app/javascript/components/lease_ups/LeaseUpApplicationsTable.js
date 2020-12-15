import React, { useEffect, useState } from 'react'

import classNames from 'classnames'
import { trim } from 'lodash'
import ReactTable from 'react-table'

import Button from 'components/atoms/Button'
import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'
import PreferenceRankCell from 'components/lease_ups/application_page/PreferenceRankCell'
import StatusCell from 'components/lease_ups/application_page/StatusCell'
import { MAX_SERVER_LIMIT } from 'utils/EagerPagination'
import { cellFormat } from 'utils/reactTableUtils'
import { getLeaseUpStatusClass } from 'utils/statusUtils'

const CELL_PADDING_PX = 16
const STATUS_COLUMN_WIDTH_PX = 192

const getCellWidth = (baseSizePx, isAtStartOrEnd = false) => {
  // We put 1/2 cell padding on either side of every cell so that the total padding between
  // cells is CELL_PADDING_PX. However, if the cell is at the start or end we want the full
  // padding on one side and half padding on the other side, so we need to multiply the padding by 1.5x.
  const padding = isAtStartOrEnd ? 1.5 * CELL_PADDING_PX : CELL_PADDING_PX
  return baseSizePx + padding
}

const textCell = ({ value }) => {
  const textStyle = {
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }

  return (
    <div style={textStyle} title={value}>
      {value}
    </div>
  )
}

const LeaseUpApplicationsTable = ({
  listingId,
  dataSet,
  onLeaseUpStatusChange,
  onCellClick,
  loading,
  onFetchData,
  pages,
  rowsPerPage,
  atMaxPages,
  bulkCheckboxesState,
  onBulkCheckboxClick
}) => {
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    setCurrentPage(0)
  }, [pages])

  const maxPagesMsg = `Unfortunately, we can only display the first ${
    MAX_SERVER_LIMIT / rowsPerPage
  } pages of applications at this time. Please use the filters above to narrow your results.`
  const noDataMsg = atMaxPages ? maxPagesMsg : 'No results, try adjusting your filters'
  const columns = [
    {
      Header: '',
      accessor: 'bulk_checkbox',
      headerClassName: 'non-resizable',
      width: getCellWidth(24, true),
      Cell: (cell) => {
        const appId = cell.original.application_id
        return (
          <CheckboxCell
            checked={bulkCheckboxesState[appId]}
            applicationId={appId}
            onClick={() => onBulkCheckboxClick(appId)}
          />
        )
      }
    },
    {
      Header: 'Rank',
      accessor: 'rankOrder',
      headerClassName: 'non-resizable',
      width: getCellWidth(88),
      Cell: (cell) => (
        <PreferenceRankCell
          preferenceRank={cell.original.preference_rank}
          preferenceValidation={cell.original.post_lottery_validation}
        />
      )
    },
    {
      Header: 'Application',
      accessor: 'application_number',
      headerClassName: 'non-resizable',
      width: getCellWidth(96),
      Cell: (cell) => (
        <Button classes='button-link' onClick={() => onCellClick(cell)}>
          {cell.value}
        </Button>
      )
    },
    {
      Header: 'First Name',
      accessor: 'first_name',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(98),
      Cell: textCell
    },
    {
      Header: 'Last Name',
      accessor: 'last_name',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(98),
      Cell: textCell
    },
    {
      Header: 'HH',
      accessor: 'total_household_size',
      headerClassName: 'non-resizable',
      width: getCellWidth(24)
    },
    {
      Header: 'Requests',
      accessor: 'accessibility',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(84),
      Cell: textCell
    },
    {
      Header: 'Updated',
      accessor: 'status_last_updated',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(75),
      Cell: cellFormat.date
    },
    {
      Header: 'Latest Substatus',
      accessor: 'sub_status',
      className: 'td-offset-right',
      headerClassName: 'td-offset-right',

      // this cell actually goes underneath the fixed column,
      // so it needs to combine both cells' widths.
      minWidth: getCellWidth(153 + STATUS_COLUMN_WIDTH_PX),
      Cell: textCell
    },
    {
      Header: 'Status',
      accessor: 'lease_up_status',
      className: 'td-status td-fixed-right',
      headerClassName: 'tr-fixed-right',
      minWidth: getCellWidth(STATUS_COLUMN_WIDTH_PX, true),
      Cell: (cell) => {
        const { application_id: applicationId } = cell.original
        return (
          <StatusCell
            applicationId={applicationId}
            status={cell.value}
            onChange={(val) => onLeaseUpStatusChange(val, applicationId)}
          />
        )
      }
    }
  ]

  const getTdProps = (state, rowInfo, column) => {
    const attrs = {}

    // onClick actions vary depending on the type of column
    if (
      column.id !== 'application_number' &&
      column.id !== 'lease_up_status' &&
      column.id !== 'bulk_checkbox'
    ) {
      attrs.onClick = (e, handleOriginal) => {
        if (rowInfo) onCellClick(rowInfo)
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName =
      rowInfo && !!trim(rowInfo.row.lease_up_status)
        ? getLeaseUpStatusClass(rowInfo.row.lease_up_status)
        : ''

    const trClassName = classNames('rt-tr-status', statusClassName)

    return {
      className: trClassName,
      tabIndex: '0'
    }
  }

  // Selecting the size of pages does not work with manual override.
  const getPaginationProps = () => {
    return {
      showPageSizeOptions: false
    }
  }

  return (
    <ReactTable
      manual
      className='rt-table-status'
      data={dataSet}
      page={currentPage}
      pages={pages}
      columns={columns}
      getTdProps={getTdProps}
      getTrProps={getTrProps}
      defaultPageSize={rowsPerPage}
      sortable={false}
      loading={loading}
      onFetchData={(state, instance) => {
        setCurrentPage(state.page)
        onFetchData(state, instance)
      }}
      noDataText={noDataMsg}
      getPaginationProps={getPaginationProps}
    />
  )
}

export default LeaseUpApplicationsTable
