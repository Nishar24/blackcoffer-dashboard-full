export default function DataTable({ result, page, onPageChange }) {
  const records = result?.data || [];

  return (
    <div className="panel panel--wide">
      <p className="panel__title">Insight records</p>
      <p className="panel__caption">
        Showing {records.length} of {result?.total ?? 0} matching records
      </p>

      {records.length === 0 ? (
        <div className="panel__empty">No records match the current filters.</div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Topic</th>
                  <th>Sector</th>
                  <th>Country</th>
                  <th>PEST</th>
                  <th>Intensity</th>
                  <th>Likelihood</th>
                  <th>Relevance</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td style={{ maxWidth: 340 }}>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noreferrer">
                          {r.title}
                        </a>
                      ) : (
                        r.title
                      )}
                    </td>
                    <td>{r.topic || "—"}</td>
                    <td>{r.sector || "—"}</td>
                    <td>{r.country || "—"}</td>
                    <td>{r.pestle ? <span className="tag">{r.pestle}</span> : "—"}</td>
                    <td>{r.intensity}</td>
                    <td>{r.likelihood}</td>
                    <td>{r.relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {result?.totalPages || 1}
            </span>
            <button disabled={page >= (result?.totalPages || 1)} onClick={() => onPageChange(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
