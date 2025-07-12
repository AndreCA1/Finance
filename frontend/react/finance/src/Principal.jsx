export default function Principal() {
  return (
    <div className="d2c_wrapper">
      {/* Preloader */}
      <div className="preloader">
        <img src="/assets/images/logo/logo-full.png" alt="DesignToCodes" />
      </div>

      {/* Main Body */}
      <div className="d2c_main p-4 ps-lg-3">
        <h4 className="mb-4 text-capitalize">Dashboard</h4>

        <div className="row d2c_home_card">
          <div className="col-xxl-9">
            <div className="row">
              {/* Cartões de exemplo podem ser colocados aqui */}
            </div>
          </div>

          <div className="col-xxl-3 mb-4">
            {/* Budget Goals */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Budget Goals</h6>
              </div>
              <div className="card-body mt-3">{/* Cards de metas */}</div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="row">
          <div className="col-xl-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6>Balance Summary</h6>
                <h4 className="text-primary">$12,389.54</h4>
              </div>
              <div className="card-body">
                <div id="d2c_lineChart"></div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6>Balance</h6>
                <h4 className="text-primary">$12,389.54</h4>
              </div>
              <div className="card-body">
                <div id="d2c_barChart"></div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6>All Expanses</h6>
                <div className="row">
                  <div className="col">
                    <p className="mb-0">Daily</p>
                    <p>$678.09</p>
                  </div>
                  <div className="col">
                    <p className="mb-0">Weekly</p>
                    <p>$1,904.21</p>
                  </div>
                  <div className="col">
                    <p className="mb-0">Monthly</p>
                    <p>$29,904.21</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div id="d2c_dashboard_radialBarChart"></div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6>Market Cap</h6>
              </div>
              <div className="card-body">
                <div id="d2c_dashboard_donutChart"></div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6>Investment</h6>
                <h4 className="text-primary">$78,537.48</h4>
              </div>
              <div className="card-body">
                <div id="d2c_investment_bar_chart"></div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6>Stock Watch list</h6>
                <h4 className="text-primary">$8,537.48</h4>
              </div>
              <div className="card-body">
                <div id="d2c_areaChart"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card h-auto d2c_projects_datatable">
              <div className="card-header">
                <h6>Advance Table</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table" id="d2c_advanced_table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "170px" }}>Date</th>
                        <th style={{ minWidth: "170px" }}>Customer</th>
                        <th style={{ minWidth: "130px" }}>Group Name</th>
                        <th style={{ minWidth: "130px" }}>Voucher</th>
                        <th style={{ minWidth: "130px" }}>Payment Type</th>
                        <th style={{ minWidth: "130px" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* As linhas da tabela devem ser renderizadas dinamicamente em React real */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão do Offcanvas */}
      <button
        className="d2c_offcanvas_toggle position-fixed top-50 start-0 translate-middle-y d-block d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#d2c_sidebar"
        aria-controls="d2c_sidebar"
      >
        <i className="far fa-hand-point-right"></i>
      </button>
    </div>
  );
}
