import React from "react";

export default function Table({ columns, data, filters, onFilterChange }) {
  return (
    <div className="card h-auto">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ minWidth: col.minWidth || "130px" }}
                  >
                    <div>{col.label}</div>

                    {/* Verifica se há uma key antes de renderizar filtro */}
                    {col.key && col.key !== "amount" ? (
                      col.key === "date" ? (
                        <select
                          value={filters[col.key] || ""}
                          onChange={(e) =>
                            onFilterChange(col.key, Number(e.target.value))
                          }
                          style={{ width: "100%", fontSize: "0.8rem" }}
                        >
                          <option value="">Mês atual</option>
                          <option value={1}>Janeiro</option>
                          <option value={2}>Fevereiro</option>
                          <option value={3}>Março</option>
                          <option value={4}>Abril</option>
                          <option value={5}>Maio</option>
                          <option value={6}>Junho</option>
                          <option value={7}>Julho</option>
                          <option value={8}>Agosto</option>
                          <option value={9}>Setembro</option>
                          <option value={10}>Outubro</option>
                          <option value={11}>Novembro</option>
                          <option value={12}>Dezembro</option>
                        </select>
                      ) : col.key === "status" ? (
                        <select
                          value={filters[col.key] || ""}
                          onChange={(e) => onFilterChange(col.key, e.target.value)}
                          style={{ width: "100%", fontSize: "0.8rem" }}
                        >
                          <option value="">Todos</option>
                          <option value="PAID">PAID</option>
                          <option value="UNPAID">UNPAID</option>
                          <option value="CARD">CARD</option>
                        </select>
                      ) : col.key === "type" ? (
                        <select
                          value={filters[col.key] || ""}
                          onChange={(e) => onFilterChange(col.key, e.target.value)}
                          style={{ width: "100%", fontSize: "0.8rem" }}
                        >
                          <option value="">Todos</option>
                          <option value="INCOME">INCOME</option>
                          <option value="INVESTMENT">INVESTMENT</option>
                          <option value="SPENT">SPENT</option>
                          <option value="CASHBACK">CASHBACK</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          value={filters[col.key] || ""}
                          onChange={(e) => onFilterChange(col.key, e.target.value)}
                          placeholder="Filtrar..."
                          style={{ width: "100%", fontSize: "0.8rem" }}
                        />
                      )
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
