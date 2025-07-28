import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApexCharts from "apexcharts";
import { fetchJSData } from "../utils/api";
import InfoCard from "../utils/InfoCard";
import Table from "../utils/Table";
import CreateTransactionModal from "./modals/CreateTransaction";
import EditableName from "./modals/EditableName";
import { toast } from "react-toastify";

export default function Dashboard() {
  let userId = 0;
  let username = localStorage.getItem("username");

  //tema
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  //logout
  const handleLogout = (event) => {
  // Impede o comportamento padrão do link (que é navegar para a href)
  event.preventDefault();

  // Remove os itens do localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");

  // Opcional: Redireciona o usuário para a página inicial/login
  window.location.href = "/";
};

  //sumario para cards
  const [summary, setSummary] = useState({
    income: 0,
    totalSpent: 0,
    totalTransactions: 0,
    totalCashback: 0,
    totalInvestment: 0,
  });

  //anuario para graficos
  const [anuary, setAnuary] = useState({
    income: Array(12).fill(0),
    totalInvestment: Array(12).fill(0),
  });

  //DECODE TOKEN TO GET USERID
  const token = localStorage.getItem("access_token");
  if (token) {
    const tokenDecoded = jwtDecode(token);
    userId = tokenDecoded.user_id;
  }

  //useStates para recarregar especificos
  const [reload, setReload] = useState(0);


  //modal alterar nome
  const handleAlterName = async (name) => {
    if (!name) {
      toast.error("Nome não pode ser vazio");
      return;
    }
    const formated = {
      name: name,
    };

    try {
      const response = await fetch("http://localhost:8080/user/" + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formated),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar nome");
      }


      localStorage.setItem("username", name);

      toast.success("Nome alterado");
    } catch (error) {
      toast.error("Erro ao atualizar useState: " + error.message);
    }
  };

  //modal para transações
  const [showModalTransiction, setshowModalTransiction] = useState(false);

  const handleNewTransaction = async (data) => {
    const formated = {
      date: data.date,
      payee: data.customerName,
      type: data.actionType,
      status: data.paymentStatus,
      amount: data.amount,
      userId: userId,
    };

    try {
      const response = await fetch("http://localhost:8080/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formated),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar transação");
      }

      const result = await response.json();
      setTableData((prev) => [...prev, result]);

      setshowModalTransiction(false);
      setReload((prev) => prev + 1);
      toast.success("Transação enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar useState: " + error.message);
    }
  };
  //
  // Tabela final
  const tableHeaders = [
    {
      key: "date",
      label: "Date",
      minWidth: "170px",
      render: (value) => {
        if (!value) return "";
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    { key: "payee", label: "Customer" },
    { key: "type", label: "Group Name" },
    {
      key: "status",
      label: "Payment Type",
      render: (value) => {
        let className = "";
        if (value === "CARD") className = "text-warning";
        else if (value === "PAID") className = "text-success";
        else if (value === "UNPAID") className = "text-danger";

        return <span className={className}>{value}</span>;
      },
    },
    {
      label: "Amount",
      key: "amount",
      render: (value) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value),
    },
  ];
  const [tableData, setTableData] = useState([
    {
      date: "",
      payee: "",
      type: "",
      status: "",
      amount: 0,
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [filters, setFilters] = useState({
    payee: "",
    type: "",
    status: "",
  });

  const handleFilterChange = (key, value) => {
    if (key === "date") {
      // Atualiza o selectedMonth com o valor selecionado ("" ou 1-12)
      setSelectedMonth(value === "" ? "" : Number(value));
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // filtro de dados
  const filteredData = tableData.filter((row) => {
    return Object.keys(filters).every((key) => {
      if (key === "date") return true;

      const filterValue = filters[key].toLowerCase();
      const cellValue = (row[key] || "").toString().toLowerCase();

      if (!filterValue) return true;

      if (key === "status" || key === "type") {
        return cellValue === filterValue;
      }

      return cellValue.includes(filterValue);
    });
  });

  //useEffect para dados da tabela ao final
  useEffect(() => {
    let url = `http://localhost:8080/transaction/${userId}/month`;

    // Se tiver mês selecionado, adiciona à URL
    if (selectedMonth !== "") {
      url += `/${selectedMonth}`;
    }
    //se não re-seta
    else {
      url = `http://localhost:8080/transaction/${userId}/month`;
    }

    fetchJSData(url, token)
      .then((data) => {
        const trans = data.content;

        setTableData(
          trans.map((item) => ({
            date: item.date || "",
            payee: item.payee || "",
            type: item.type || "",
            status: item.status || "",
            amount: item.amount || 0,
          })),
        );
      })
      .catch((err) => {
        toast.error("Erro ao buscar resumo financeiro: " + err);
      });
  }, [token, userId, reload, selectedMonth]);

  //useEffect para alterar grafico de barras BALANCE
  useEffect(() => {
    if (!userId || !token) return;

    fetchJSData("http://localhost:8080/month/" + userId + "/all", token)
      .then((data) => {
        const months = data.content;

        const incomeArray = Array(12).fill(0);
        const investmentArray = Array(12).fill(0);

        months.forEach((item) => {
          const monthIndex = parseInt(item.date.split("-")[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            incomeArray[monthIndex] = item.income || 0;
            investmentArray[monthIndex] = item.totalInvestment || 0;
          }
        });

        setAnuary({
          income: incomeArray,
          totalInvestment: investmentArray,
        });
      })
      .catch((err) => {
        toast.error("Erro ao buscar resumo financeiro: " + err);
      });
  }, [token, userId, reload]);

  // useEfect para setar os dados dos cards
  useEffect(() => {
    fetchJSData("http://localhost:8080/month/" + userId, token)
      .then((data) => {
        setSummary({
          income: data.income,
          totalSpent: data.totalSpent,
          totalTransactions: data.totalTransactions,
          totalCashback: data.totalCashback,
          totalInvestment: data.totalInvestment,
        });
      })
      .catch((err) => {
        toast.error("Erro ao buscar resumo financeiro: " + err);
      });
  }, [token, userId, reload]);

  // useEffect só para controlar o tema
  useEffect(() => {
    const darkClass = "d2c_theme_dark";
    const lightClass = "d2c_theme_light";

    const newClass = isDarkTheme ? darkClass : lightClass;
    const oldClass = isDarkTheme ? lightClass : darkClass;

    document.body.classList.add(newClass);

    const timeoutId = setTimeout(() => {
      document.body.classList.remove(oldClass);
    }, 100);

    localStorage.setItem("theme", newClass);

    return () => clearTimeout(timeoutId);
  }, [isDarkTheme]);

  // useEffect para os graficos com apexchart
  useEffect(() => {
    if (!anuary.income || anuary.income.every((v) => v === 0)) return;
    const charts = [
      {
        selector: "#d2c_barChart",
        options: {
          chart: {
            type: "bar",
            foreColor: "#ccc",
            toolbar: { show: false },
            fontFamily: "Poppins, sans-serif",
          },
          series: [
            {
              name: "Income",
              data: anuary.income,
            },
          ],
          colors: ["rgba(0, 170, 93, 0.7)"],
          legend: { show: false },
          dataLabels: { enabled: false },
          yaxis: { labels: { formatter: (y) => `${y.toFixed(0)}K` } },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
          plotOptions: {
            bar: { horizontal: false, borderRadius: 3, barHeight: "70%" },
          },
        },
      },
      {
        selector: "#d2c_investment_bar_chart",
        options: {
          chart: {
            type: "bar",
            foreColor: "#ccc",
            toolbar: { show: false },
            fontFamily: "Poppins, sans-serif",
          },
          series: [
            {
              name: "Income",
              data: anuary.totalInvestment,
            },
          ],
          colors: ["rgba(0, 170, 93, 0.7)"],
          legend: { show: false },
          dataLabels: { enabled: false },
          yaxis: { labels: { formatter: (y) => `${y.toFixed(0)}K` } },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
          plotOptions: {
            bar: { horizontal: false, borderRadius: 3, barHeight: "70%" },
          },
        },
      },
    ];

    const chartInstances = [];

    charts.forEach(({ selector, options }) => {
      const el = document.querySelector(selector);
      if (el) {
        const chart = new ApexCharts(el, options);
        chart.render();
        chartInstances.push(chart); // guarda para destruição
      }
    });

    return () => {
      chartInstances.forEach((chart) => chart.destroy());
    };
  }, [anuary]);
  // useEffect para montar o tema salvo e os outros comportamentos (preloader, validação)
  useEffect(() => {
    // Recupera tema salvo no localStorage ao montar
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "d2c_theme_dark") {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }

    // === PRELOADER ===
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".d2c_wrapper");
    const preloaderTimeout = setTimeout(() => {
      if (preloader) preloader.style.display = "none";
      if (wrapper) wrapper.classList.add("show");
    }, 1000);

    // === VALIDAÇÃO DE FORMULÁRIO ===
    const forms = document.querySelectorAll(".form-validation");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      });
    });

    return () => {
      clearTimeout(preloaderTimeout);
      // Limpeza dos event listeners dos forms
      forms.forEach((form) => {
        form.removeEventListener("submit", () => {});
      });
    };
  }, []);

  // Handler para o toggle do switch do tema
  const handleThemeToggle = (e) => {
    setIsDarkTheme(e.target.checked);
  };

  return (
    <>
      {/* Preloader Start */}
      <div className="preloader">
        <img src="./assets/images/logo/logo-full.png" alt="DesignToCodes" />
      </div>
      {/* Preloader End */}

      <div className="d2c_wrapper">
        {/* Main sidebar */}
        <div
          className="d2c_sidebar offcanvas offcanvas-start p-4 pe-lg-2"
          tabIndex="-1"
          id="d2c_sidebar"
        >
          <div className="d-flex flex-column">
            {/* Logo */}
            <a href="./index.html" className="mb-5 brand-icon">
              <img
                className="navbar-brand"
                src="./assets/images/logo/logo-sm-new.png"
                alt="logo"
              />
            </a>
            {/* End:Logo */}

            {/* Profile */}
            <div className="card d2c_profile_card text-center mb-4">
              {/* Profile Image */}
                <img
                  className="rounded-circle d2c_profile_image position-absolute top-0 start-50 translate-middle mb-2"
                  src="./assets/images/profile/profile-1.jpg"
                  alt="d2c Profile Image"
                />
              {/* End:Profile Image*/}
              <div className="card-body mt-4">
                <div className="nav-link p-0 d-inline-flex align-items-center gap-2">
                  <EditableName
                    initialName={username}
                    onSubmit={handleAlterName}
                  />
                </div>
              </div>
            </div>
            {/* End:Profile */}
            {/* Theme Mode */}
            <div className="card d2c_switch_card">
              <div className="card-body p-0">
                <ul className="navbar-nav">
                  <li className="nav-item d-flex align-items-center">
                    <span className="d2c_icon">
                      <i className="fas fa-moon"></i>
                    </span>
                    <span>Dark Mode</span>
                    <span className="form-switch d-flex ms-auto">
                      <input
                        className="form-check-input"
                        id="d2c_theme_changer"
                        type="checkbox"
                        role="switch"
                        checked={isDarkTheme}
                        onChange={handleThemeToggle}
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* End:Theme Mode */}
            {/* Logout */}
            <div className="card d2c_single_menu mb-4">
              <div className="card-body p-0">
                <ul className="navbar-nav">
                  {/* Item */}
                  <li className="nav-item">
                    <a className="nav-link" href="/" onClick={handleLogout}>
                      <span className="d2c_icon text-danger">
                        <i className="fas fa-sign-out-alt"></i>
                      </span>
                      <span> Logout </span>
                    </a>
                  </li>
                  {/* End:Item */}
                </ul>
              </div>
            </div>
            {/* End:Logout */}
          </div>
        </div>
        {/* End:Sidebar */}

        {/* Main Body*/}
        <div className="d2c_main p-4 ps-lg-3">
          {/* Title */}
          <h4 className="mb-4 text-capitalize">Dashboard</h4>
          {/* End:Title */}

          <div className="row d2c_home_card">
            <div className="col-xxl-12">
              <div className="row">
                {/* Income Card */}
                <InfoCard
                  title="Income"
                  subtitle="This Month"
                  value={summary.income ?? 0}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Total Spent */}
                <InfoCard
                  title="Total Spent"
                  subtitle="This Month"
                  value={summary.totalSpent ?? 0}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Total Cashback */}
                <InfoCard
                  title="Total Cashback"
                  subtitle="This Month"
                  value={summary.totalCashback ?? 0}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Investment */}
                <InfoCard
                  title="Investment"
                  subtitle="This Month"
                  value={summary.totalInvestment ?? 0}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 mb-4">
              {/* Balance */}
              <div className="card">
                <div className="card-header">
                  <h6>Balance</h6>
                  <h4 className="text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(anuary.income.reduce((acc, val) => acc + val, 0))}
                  </h4>
                </div>
                <div className="card-body">
                  <div id="d2c_barChart"></div>
                </div>
              </div>
              {/* End:Balance */}
            </div>

            <div className="col-xl-6 mb-4">
              {/* investment bar chart */}
              <div className="card">
                <div className="card-header">
                  <h6>Investment</h6>
                  <h4 className="text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      anuary.totalInvestment.reduce((acc, val) => acc + val, 0),
                    )}
                  </h4>
                </div>
                <div className="card-body">
                  <div id="d2c_investment_bar_chart"></div>
                </div>
              </div>
              {/* End:investment */}
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-4">
              {/* Basic Table */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Transactions</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => setshowModalTransiction(true)}
                >
                  <i className="fas fa-plus"></i> Add
                </button>
              </div>
              <Table
                columns={tableHeaders}
                data={filteredData}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              {/* End:Advanced Table */}
            </div>
          </div>

          {/*Modals*/}
          <CreateTransactionModal
            isOpen={showModalTransiction}
            onClose={() => setshowModalTransiction(false)}
            onSubmit={handleNewTransaction}
          />

          {/*END Modals*/}
        </div>
        {/* End:Main Body */}
      </div>

      {/* Offcanvas Toggler */}
      <button
        className="d2c_offcanvas_toggle position-fixed top-50 start-0 translate-middle-y d-block"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#d2c_sidebar"
        aria-controls="d2c_sidebar"
      >
        <i className="far fa-hand-point-right"></i>
      </button>
      {/* End:Offcanvas Toggler */}
    </>
  );
}
