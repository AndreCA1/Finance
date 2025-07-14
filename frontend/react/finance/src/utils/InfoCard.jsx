export default function InfoCard({
  title,
  subtitle,
  value,
  iconClass,
  textColor = "text-primary",
}) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value)
      : value;

  return (
    <div className="col-xl-4 col-md-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-8">
              <div className={`btn rounded shadow ${textColor}`}>
                <i className={iconClass}></i>
              </div>
            </div>
            <div className="col d-flex justify-content-end">
              <div className="dropdown">
                <button
                  className="btn px-1 d2c_dropdown_btn"
                  type="button"
                  id="dropdownMenuButton11"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                <ul
                  className="dropdown-menu d2c_dropdown"
                  aria-labelledby="dropdownMenuButton11"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Premium
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Regular
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h6>{title}</h6>
          <p>{subtitle}</p>
          <h4 className={`${textColor} mb-0`}>{formattedValue}</h4>
        </div>
      </div>
    </div>
  );
}
