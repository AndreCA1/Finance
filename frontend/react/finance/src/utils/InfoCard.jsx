export default function InfoCard({
  title,
  subtitle,
  value,
  iconClass,
  textColor = "text-primary",
  onOpenModal,
}) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value)
      : value;

  return (
    <div className="col-xl-6 col-md-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-8">
              <div className={`btn rounded shadow ${textColor}`}>
                <i className={iconClass}></i>
              </div>
            </div>
            <div className="col d-flex justify-content-end">
              <button className="btn btn-success" onClick={onOpenModal}>
                +
              </button>
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
