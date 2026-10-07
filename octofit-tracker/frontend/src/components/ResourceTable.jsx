import { getDisplayValue } from '../api.js'

function ResourceTable({ columns, records }) {
  if (records.length === 0) {
    return <p className="text-body-secondary mb-0">No records to show yet.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record._id ?? record.id ?? `${index}`}>
              {columns.map((column) => (
                <td key={column.key}>{getDisplayValue(record[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResourceTable
