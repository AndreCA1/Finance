import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApexCharts from "apexcharts";
import { fetchJSData } from "../utils/api";
import InfoCard from "../utils/InfoCard";

export default function Dashboard() {
  let userId = 0;
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [summary, setSummary] = useState({
    income: 0,
    totalSpent: 0,
    totalTransactions: 0,
    totalCashback: 0,
    totalInvestment: 0,
  });

  const [anuary, setAnuary] = useState({
    income: Array(12).fill(0),
    totalSpent: Array(12).fill(0),
    totalCashback: Array(12).fill(0),
    totalInvestment: Array(12).fill(0),
  });

  const token = localStorage.getItem("access_token");
  if (token) {
    const tokenDecoded = jwtDecode(token);
    userId = tokenDecoded.user_id;
  }

  //useEffect para alterar grafico de barras BALANCE
  useEffect(() => {
    fetchJSData("http://localhost:8080/month/" + userId + "/all", token)
      .then((data) => {
        const months = data.content;

        const incomeArray = Array(12).fill(0);
        const spentArray = Array(12).fill(0);
        const cashbackArray = Array(12).fill(0);
        const investmentArray = Array(12).fill(0);

        months.forEach((item) => {
          const monthIndex = parseInt(item.date.split("-")[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            incomeArray[monthIndex] = item.income || 0;
          }
          incomeArray[monthIndex] = item.income || 0;
          spentArray[monthIndex] = item.totalSpent || 0;
          cashbackArray[monthIndex] = item.totalCashback || 0;
          investmentArray[monthIndex] = item.totalInvestment || 0;
        });

        setAnuary({
          income: incomeArray,
          totalSpent: spentArray,
          totalCashback: cashbackArray,
          totalInvestment: investmentArray,
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar resumo financeiro", err);
      });
  }, [token, userId]);

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
        console.error("Erro ao buscar resumo financeiro", err);
      });
  }, [token, userId]);

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
        selector: "#d2c_lineChart",
        options: {
          series: [
            {
              name: "Desktops",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
            },
          ],
          chart: {
            type: "line",
            foreColor: "#ccc",
            fontFamily: "Poppins, sans-serif",
            toolbar: {
              show: false,
            },
          },
          colors: ["#FFC107"],
          dataLabels: {
            enabled: false,
          },
          markers: {
            size: 5,
          },
          stroke: {
            width: 2,
            curve: "smooth",
          },
          grid: {
            show: true,
            borderColor: "rgba(56, 56, 56, 0.06)",
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
          },
          yaxis: {
            labels: {
              formatter: function (y) {
                return y.toFixed(0) + "K";
              },
            },
          },
          xaxis: {
            categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        },
      },
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
        selector: "#d2c_dashboard_radialBarChart",
        options: {
          series: [44, 55, 67, 83],
          chart: {
            type: "radialBar",
            foreColor: "#ccc",
            fontFamily: "Poppins, sans-serif",
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: { fontSize: "22px" },
                value: { fontSize: "16px" },
                total: { show: false, label: "Total", formatter: () => 249 },
              },
            },
          },
          labels: ["Apples", "Oranges", "Bananas", "Berries"],
          colors: ["#00AA5D", "#383838", "#FFC107", "#EF4E4E"],
        },
      },
      {
        selector: "#d2c_dashboard_donutChart",
        options: {
          series: [25, 35, 25, 15],
          chart: { type: "donut", foreColor: "rgba(56, 56, 56, 0.06)" },
          colors: ["#FFC107", "#EF4E4E", "#00AA5D", "#383838"],
          labels: ["Refund", "Margin", "Sale"],
          legend: { show: false },
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
          className="d2c_sidebar offcanvas-lg offcanvas-start p-4 pe-lg-2"
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
              <a href="./pages/elements/profile.html">
                <img
                  className="rounded-circle d2c_profile_image position-absolute top-0 start-50 translate-middle mb-2"
                  src="./assets/images/profile/profile-1.jpg"
                  alt="d2c Profile Image"
                />
              </a>
              {/* End:Profile Image*/}

              <div className="card-body mt-4">
                <h6 className="fw-bold mb-3">Wade Warren</h6>
                <ul className="list-inline">
                  {/* Notification */}
                  <li className="list-inline-item position-relative me-3">
                    <a
                      className="nav-link p-0"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-bell fa-fw"></i>
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-secondary border rounded-circle"></span>
                    </a>
                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow border-0 py-0 mt-3">
                      <h6 className="dropdown-header text-white bg-primary rounded-top py-3">
                        Notifications
                      </h6>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/elements/notification.html"
                      >
                        <div className="text-truncate d-block">
                          <p className="mb-0">
                            <small>19 sec ago</small>
                          </p>
                          <h6 className="mb-0">
                            Hi there! I am wondering if you can help me with a
                            problem I've been having.
                          </h6>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/elements/notification.html"
                      >
                        <div className="text-truncate d-block">
                          <p className="mb-0">
                            <small>2 min ago</small>
                          </p>
                          <h6 className="mb-0">
                            I have the photos that you ordered last month, how
                            would you like them sent to you?
                          </h6>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/elements/notification.html"
                      >
                        <div className="text-truncate d-block">
                          <p className="mb-0">
                            <small>3 min ago</small>
                          </p>
                          <h6 className="mb-0">
                            Last month's report looks great, I am very happy
                            with the progress so far, keep up the good work!
                          </h6>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/elements/notification.html"
                      >
                        <div className="text-truncate d-block">
                          <p className="mb-0">
                            <small>4 min ago</small>
                          </p>
                          <h6 className="mb-0">
                            Am I a good boy? The reason I ask is because someone
                            told me that people say this to all dogs, even if
                            they aren't good...
                          </h6>
                        </div>
                      </a>
                      <a
                        className="dropdown-item text-center small text-gray-500 py-2"
                        href="./pages/elements/notification.html"
                      >
                        See All Notifications
                      </a>

                      <div className="dropdown-arrow bg-info"></div>
                    </div>
                  </li>
                  {/* End:Notification */}

                  {/* MailBox */}
                  <li className="list-inline-item position-relative me-3">
                    <a
                      className="nav-link p-0"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-envelope-open-text"></i>
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                    </a>
                    <div className="dropdown-list dropdown-menu shadow border-0 end-0 py-0 mt-3">
                      <h6 className="dropdown-header text-white bg-primary rounded-top py-3">
                        Mail
                      </h6>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/mailDetails.html"
                      >
                        <div className="text-truncate d-flex align-items-center">
                          <div>
                            <img
                              src="./assets/images/avatar/man-1.png"
                              className="d2c_mail_avatar"
                              alt="profile avatar"
                            />
                          </div>
                          <div>
                            <p className="mb-0">
                              <small>3 min ago</small>
                            </p>
                            <h6 className="mb-0">
                              Hi there! I am wondering if you can help me with a
                              problem I've been having.
                            </h6>
                          </div>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/mailDetails.html"
                      >
                        <div className="text-truncate d-flex align-items-center">
                          <div>
                            <img
                              src="./assets/images/avatar/man-2.png"
                              className="d2c_mail_avatar"
                              alt="profile avatar"
                            />
                          </div>
                          <div>
                            <p className="mb-0">
                              <small>4 min ago</small>
                            </p>
                            <h6 className="mb-0">
                              I have the photos that you ordered last month, how
                              would you like them sent to you?
                            </h6>
                          </div>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/mailDetails.html"
                      >
                        <div className="text-truncate d-flex align-items-center">
                          <div>
                            <img
                              src="./assets/images/avatar/man-3.png"
                              className="d2c_mail_avatar"
                              alt="profile avatar"
                            />
                          </div>
                          <div>
                            <p className="mb-0">
                              <small>6 min ago</small>
                            </p>
                            <h6 className="mb-0">
                              Last month's report looks great, I am very happy
                              with the progress so far, keep up the good work!
                            </h6>
                          </div>
                        </div>
                      </a>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="./pages/mailDetails.html"
                      >
                        <div className="text-truncate d-flex align-items-center">
                          <div>
                            <img
                              src="./assets/images/avatar/man-4.png"
                              className="d2c_mail_avatar"
                              alt="profile avatar"
                            />
                          </div>
                          <div>
                            <p className="mb-0">
                              <small>10 min ago</small>
                            </p>
                            <h6 className="mb-0">
                              Am I a good boy? The reason I ask is because
                              someone told me that people say this to all dogs,
                              even if they aren't good..
                            </h6>
                          </div>
                        </div>
                      </a>
                      <a
                        className="dropdown-item text-center small text-gray-500 py-2"
                        href="./pages/mailDetails.html"
                      >
                        See All Mail
                      </a>

                      <div className="dropdown-arrow bg-info"></div>
                    </div>
                  </li>
                  {/* End:MailBox */}

                  {/* Setting*/}
                  <li className="list-inline-item position-relative">
                    <a
                      className="nav-link p-0"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-cog"></i>
                    </a>
                    <div className="dropdown-list dropdown-menu shadow border-0 end-0 py-0 mt-3">
                      <h6 className="dropdown-header text-white bg-primary rounded-top py-3">
                        Settings
                      </h6>
                      <div className="d2c_profile_settings">
                        <a
                          className="dropdown-item d-flex align-items-center py-2"
                          href="./pages/support.html"
                        >
                          <i className="fas fa-sms"></i>
                          <p className="mb-0 ms-2 fw-normal">Messages</p>
                        </a>
                        <a
                          className="dropdown-item d-flex align-items-center py-2"
                          href="./pages/elements/profile.html"
                        >
                          <i className="fas fa-user-cog"></i>
                          <p className="mb-0 ms-2 fw-normal">
                            Profile Settings
                          </p>
                        </a>
                        <a
                          className="dropdown-item d-flex align-items-center py-2"
                          href="#"
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          <p className="mb-0 ms-2 fw-normal">Log Out</p>
                        </a>
                      </div>
                    </div>
                  </li>
                  {/* End:Setting */}
                </ul>

                {/* Search */}
                <form>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search"
                    />
                  </div>
                </form>
                {/* End:Search */}
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

            {/* Menu */}
            <div className="card d2c_menu_card mb-4">
              <div className="card-body">
                <ul className="navbar-nav flex-grow-1">
                  {/* Menu Item */}
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span>Menu</span>
                    </a>
                    {/* Sub Menu */}
                    <ul className="sub-menu collapse show">
                      {/* Sub Menu Item */}
                      <li className="nav-item active">
                        <a className="sub-menu-link" href="./index.html">
                          <span className="d2c_icon">
                            <i className="fas fa-home"></i>
                          </span>
                          <span> Overview </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/payment.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-money-check-alt"></i>
                          </span>
                          <span> Payment </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/transaction.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-list-alt"></i>
                          </span>
                          <span> Transaction </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a className="sub-menu-link" href="./pages/wallet.html">
                          <span className="d2c_icon">
                            <i className="fas fa-wallet"></i>
                          </span>
                          <span> Wallet </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/investment.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-network-wired"></i>
                          </span>
                          <span> Investment </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/stocksFund.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-chart-line"></i>
                          </span>
                          <span> Stock & Fund </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}
                    </ul>
                    {/* End:Sub Menu */}
                  </li>
                  {/* End:Menu Item */}

                  {/* Menu Item */}
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span>Extra</span>
                    </a>

                    {/* Sub Menu*/}
                    <ul className="sub-menu collapse show" id="extra">
                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a className="sub-menu-link" href="./pages/faq.html">
                          <span className="d2c_icon">
                            <i className="fas fa-question-circle"></i>
                          </span>
                          <span> FAQ </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          data-bs-toggle="collapse"
                          data-bs-target="#authentication"
                          aria-expanded="false"
                          href="#"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-sticky-note"></i>
                          </span>
                          <span> Authentication </span>
                          <span className="fas fa-chevron-right ms-auto text-end"></span>
                        </a>
                        {/* Child Sub Menu */}
                        <ul className="sub-menu collapse" id="authentication">
                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/authentication/signUp.html"
                            >
                              <span> Sing up </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/authentication/signIn.html"
                            >
                              <span> Login </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/authentication/forgetPassword.html"
                            >
                              <span> Forget Password </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/authentication/404.html"
                            >
                              <span> 404 </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}
                        </ul>
                        {/* End:Child Sub Menu */}
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          data-bs-toggle="collapse"
                          data-bs-target="#elements"
                          aria-expanded="false"
                          href="#"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-th"></i>
                          </span>
                          <span> Elements </span>
                          <span className="fas fa-chevron-right ms-auto text-end"></span>
                        </a>
                        {/* Child Sub Menu */}
                        <ul className="sub-menu collapse" id="elements">
                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link active"
                              href="./pages/elements/notification.html"
                            >
                              <span> Notification </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/elements/profile.html"
                            >
                              <span> User Profile </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="sub-menu-link"
                              data-bs-toggle="collapse"
                              data-bs-target="#charts-elements"
                              aria-expanded="false"
                              href="#"
                            >
                              <span> Charts </span>
                              <span className="fas fa-chevron-right ms-auto text-end"></span>
                            </a>

                            {/* Start:Submenu List*/}
                            <ul
                              className="sub-menu collapse"
                              id="charts-elements"
                            >
                              {/* Child Sub Menu Item */}
                              <li className="nav-item">
                                <a
                                  className="nav-link"
                                  href="./pages/elements/chartsjs.html"
                                >
                                  <span> ChartJs </span>
                                </a>
                              </li>
                              {/* End:Child Sub Menu Item */}
                              {/* Child Sub Menu Item */}
                              <li className="nav-item">
                                <a
                                  className="nav-link"
                                  href="./pages/elements/apexchart.html"
                                >
                                  <span> ApexChart </span>
                                </a>
                              </li>
                              {/* End:Child Sub Menu Item */}
                            </ul>
                            {/* End:Submenu List*/}
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="sub-menu-link"
                              data-bs-toggle="collapse"
                              data-bs-target="#table-elements"
                              aria-expanded="false"
                              href="#"
                            >
                              <span> Table </span>
                              <span className="fas fa-chevron-right ms-auto text-end"></span>
                            </a>

                            {/* Start:Submenu List*/}
                            <ul
                              className="sub-menu collapse"
                              id="table-elements"
                            >
                              {/* Child Sub Menu Item */}
                              <li className="nav-item">
                                <a
                                  className="nav-link"
                                  href="./pages/elements/basictables.html"
                                >
                                  <span> Basic Table </span>
                                </a>
                              </li>
                              {/* End:Child Sub Menu Item */}
                            </ul>
                            {/* End:Submenu List*/}
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="sub-menu-link"
                              data-bs-toggle="collapse"
                              data-bs-target="#form-elements"
                              aria-expanded="false"
                              href="#"
                            >
                              <span> Form </span>
                              <span className="fas fa-chevron-right ms-auto text-end"></span>
                            </a>

                            {/* Start:Submenu List*/}
                            <ul
                              className="sub-menu collapse"
                              id="form-elements"
                            >
                              {/* Child Sub Menu Item */}
                              <li className="nav-item">
                                <a
                                  className="nav-link"
                                  href="./pages/elements/basicformselement.html"
                                >
                                  <span> Basic Element </span>
                                </a>
                              </li>

                              {/* End:Child Sub Menu Item */}
                            </ul>
                            {/* End:Submenu List*/}
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/elements/timeline.html"
                            >
                              <span> TimeLine </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}
                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/elements/tab.html"
                            >
                              <span> Tab </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="sub-menu-link"
                              data-bs-toggle="collapse"
                              data-bs-target="#modal-elements"
                              aria-expanded="false"
                              href="#"
                            >
                              <span> Modal </span>
                              <span className="fas fa-chevron-right ms-auto text-end"></span>
                            </a>

                            {/* Start:Submenu List*/}
                            <ul
                              className="sub-menu collapse"
                              id="modal-elements"
                            >
                              {/* Child Sub Menu Item */}
                              <li className="nav-item">
                                <a
                                  className="nav-link"
                                  href="./pages/elements/basicmodal.html"
                                >
                                  <span> Basic Modal </span>
                                </a>
                              </li>

                              {/* End:Child Sub Menu Item */}
                            </ul>
                            {/* End:Submenu List*/}
                          </li>
                          {/* End:Child Sub Menu Item */}

                          {/* Child Sub Menu Item */}
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="./pages/elements/breadcrumbs.html"
                            >
                              <span> Breadcrumbs </span>
                            </a>
                          </li>
                          {/* End:Child Sub Menu Item */}
                        </ul>
                        {/* End:Child Sub Menu */}
                      </li>
                      {/* End:Sub Menu Item */}
                    </ul>
                    {/* End:Sub Menu */}
                  </li>
                  {/* End:Menu Item */}

                  {/* Menu Item */}
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span>Support</span>
                    </a>
                    {/* Sub Menu */}
                    <ul className="sub-menu collapse show" id="support">
                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/community.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-users"></i>
                          </span>
                          <span> Community </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/support.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-hands-helping"></i>
                          </span>
                          <span> Help & Support </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}

                      {/* Sub Menu Item */}
                      <li className="nav-item">
                        <a
                          className="sub-menu-link"
                          href="./pages/documentation.html"
                        >
                          <span className="d2c_icon">
                            <i className="fas fa-book-open"></i>
                          </span>
                          <span> Documentation </span>
                        </a>
                      </li>
                      {/* End:Sub Menu Item */}
                    </ul>
                    {/* End:Sub Menu */}
                  </li>
                  {/* End:Menu Item */}
                </ul>
              </div>
            </div>
            {/* End:Menu */}

            {/* Logout */}
            <div className="card d2c_single_menu mb-4">
              <div className="card-body p-0">
                <ul className="navbar-nav">
                  {/* Item */}
                  <li className="nav-item">
                    <a className="nav-link" href="/">
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
            <div className="col-xxl-9">
              <div className="row">
                {/* Visa Card */}
                <div className="col-xl-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="master-card">
                      <div className="top">
                        <h4>Esther Howard</h4>
                        <img src="https://cdn-icons-png.flaticon.com/512/1436/1436392.png" />
                      </div>
                      <div className="infos">
                        <div className="card-number mb-2">
                          <p className="mb-0">Card Number</p>
                          <h4>5495 9549 2883 2434</h4>
                        </div>
                        <div className="bottom">
                          <aside className="infos--bottom">
                            <div className="me-2">
                              <p className="mb-2">Expiry date</p>
                              <h6>08/24</h6>
                            </div>
                            <div>
                              <p className="mb-2">CVV</p>
                              <h6>748</h6>
                            </div>
                          </aside>
                          <aside>
                            <img
                              src="https://seeklogo.com/images/V/VISA-logo-DD37676279-seeklogo.com.png"
                              className="brand"
                            />
                          </aside>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income Card */}
                <InfoCard
                  title="Income"
                  subtitle="Last Month"
                  value={`$${(summary.income ?? 0).toLocaleString()}`}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Total Spent */}
                <InfoCard
                  title="Total Spent"
                  subtitle="Last Month"
                  value={`$${(summary.totalSpent ?? 0).toLocaleString()}`}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Transactions */}
                <InfoCard
                  title="Transactions"
                  subtitle="Last Month"
                  value={`$${(summary.totalTransactions ?? 0).toLocaleString()}`}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Total Cashback */}
                <InfoCard
                  title="Total Cashback"
                  subtitle="Last Month"
                  value={`$${(summary.totalCashback ?? 0).toLocaleString()}`}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />

                {/* Investment */}
                <InfoCard
                  title="Investment"
                  subtitle="Last Month"
                  value={`$${(summary.totalInvestment ?? 0).toLocaleString()}`}
                  iconClass="fas fa-dollar-sign"
                  textColor="text-primary"
                />
              </div>
            </div>

            {/* Budget Goals */}
            <div className="col-xxl-3 mb-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Budget Goals</h6>
                </div>
                <div className="card-body mt-3">
                  {/* Facebook Ads */}
                  <div className="card mb-4">
                    <div className="card-body d-flex align-items-center">
                      <div className="d2c_icon btn bg-primary text-primary rounded-circle bg-opacity-10">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="flex-1 w-100 ms-3">
                        <div className="d-flex justify-content-between mb-2">
                          Facebook Ads
                          <span className="text-end">
                            <span className="fw-bold">75</span> / 100
                          </span>
                        </div>
                        <div className="progress bg-primary bg-opacity-10">
                          <div
                            className="progress-bar bg-primary rounded"
                            role="progressbar"
                            aria-label="Basic example"
                            style={{ width: "75%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Youtube Premium */}
                  <div className="card mb-4">
                    <div className="card-body d-flex align-items-center">
                      <div className="d2c_icon btn bg-info text-info rounded-circle bg-opacity-10">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="flex-1 w-100 ms-3">
                        <div className="d-flex justify-content-between mb-2">
                          Youtube Premium
                          <span className="text-end">
                            <span className="fw-bold">50</span> / 100
                          </span>
                        </div>
                        <div className="progress bg-info bg-opacity-10">
                          <div
                            className="progress-bar bg-info rounded"
                            role="progressbar"
                            aria-label="Basic example"
                            style={{ width: "50%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skype Premium */}
                  <div className="card">
                    <div className="card-body d-flex align-items-center">
                      <div className="d2c_icon btn bg-danger text-danger rounded-circle bg-opacity-10">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="flex-1 w-100 ms-3">
                        <div className="d-flex justify-content-between mb-2">
                          Skype Premium
                          <span className="text-end">
                            <span className="fw-bold">30</span> / 100
                          </span>
                        </div>
                        <div className="progress bg-danger bg-opacity-10">
                          <div
                            className="progress-bar bg-danger rounded"
                            role="progressbar"
                            aria-label="Basic example"
                            style={{ width: "30%" }}
                            aria-valuenow="25"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 mb-4">
              {/* Balance Summary */}
              <div className="card h-100">
                <div className="card-header">
                  <h6>Balance Summary</h6>
                  <h4 className="text-primary">$12,389.54</h4>
                </div>
                <div className="card-body">
                  <div id="d2c_lineChart"></div>
                </div>
              </div>
              {/* End:Balance Summary */}
            </div>

            <div className="col-xl-6 mb-4">
              {/* Balance */}
              <div className="card">
                <div className="card-header">
                  <h6>Balance</h6>
                  <h4 className="text-primary">$12,389.54</h4>
                </div>
                <div className="card-body">
                  <div id="d2c_barChart"></div>
                </div>
              </div>
              {/* End:Balance */}
            </div>

            <div className="col-xl-6 mb-4">
              {/* All Expanses */}
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
              {/* End:All Expanses */}
            </div>

            <div className="col-xl-6 mb-4">
              {/* Market Cap */}
              <div className="card h-100">
                <div className="card-header">
                  <h6>Market Cap</h6>
                </div>
                <div className="card-body">
                  <div id="d2c_dashboard_donutChart"></div>
                </div>
              </div>
              {/* End:Market Cap */}
            </div>

            <div className="col-xl-6 mb-4">
              {/* investment bar chart */}
              <div className="card">
                <div className="card-header">
                  <h6>Investment</h6>
                  <h4 className="text-primary">$78,537.48</h4>
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
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                20 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Jane Cooper</td>
                          <td>Supplier</td>
                          <td>58755</td>
                          <td className="text-warning">Pending</td>
                          <td>$4,323.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                19 Jan 2023
                              </label>
                            </div>
                          </td>
                          <td>Alex Cooper</td>
                          <td>Vendor</td>
                          <td>58723</td>
                          <td className="text-success">Delivered</td>
                          <td>$2,432.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                16 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Hales Jane</td>
                          <td>Customer</td>
                          <td>58712</td>
                          <td className="text-danger">Unpaid</td>
                          <td>$1,582.87</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                23 Jun 2023
                              </label>
                            </div>
                          </td>
                          <td>Maria D</td>
                          <td>Supplier</td>
                          <td>34755</td>
                          <td className="text-success">Delivered</td>
                          <td>$5,582.45</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                12 Aug 2023
                              </label>
                            </div>
                          </td>
                          <td>Robert Mon</td>
                          <td>Customer</td>
                          <td>67755</td>
                          <td className="text-success">Delivered</td>
                          <td>$6,546.32</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                11 May 2023
                              </label>
                            </div>
                          </td>
                          <td>Brian Depew</td>
                          <td>Vendor</td>
                          <td>28755</td>
                          <td className="text-warning">Pending</td>
                          <td>$3,582.6</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                {" "}
                                6 Oct 2023{" "}
                              </label>
                            </div>
                          </td>
                          <td>James Murray</td>
                          <td>Customer</td>
                          <td>11755</td>
                          <td className="text-success">Delivered</td>
                          <td>$8,432.56</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                10 Oct 2023
                              </label>
                            </div>
                          </td>
                          <td>Alex Carey</td>
                          <td>Vendor</td>
                          <td>88755</td>
                          <td className="text-success">Delivered</td>
                          <td>$1,321.34</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                29 Oct 2023
                              </label>
                            </div>
                          </td>
                          <td>Jane Cooper</td>
                          <td>Vendor</td>
                          <td>56735</td>
                          <td className="text-danger">Unpaid</td>
                          <td>$6,453.66</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                27 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Gary Nunez</td>
                          <td>Vendor</td>
                          <td>45637</td>
                          <td className="text-success">Delivered</td>
                          <td>$3,321.54</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                26 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>James Bowes</td>
                          <td>Customer</td>
                          <td>90876</td>
                          <td className="text-success">Delivered</td>
                          <td>$4,582.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                25 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>David Sankey</td>
                          <td>Expenses</td>
                          <td>33425</td>
                          <td className="text-warning">Pending</td>
                          <td>$4,582.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                24 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Paul Clark</td>
                          <td>Vendor</td>
                          <td>33445</td>
                          <td className="text-warning">Pending</td>
                          <td>$4,582.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                23 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Matt Cogdell</td>
                          <td>Customer</td>
                          <td>33332</td>
                          <td className="text-success">Delivered</td>
                          <td>$4,582.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                20 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Bill Blevins</td>
                          <td>Vendor</td>
                          <td>55565</td>
                          <td className="text-success">Delivered</td>
                          <td>$4,582.39</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label className="form-check-label">
                                21 Mar 2023
                              </label>
                            </div>
                          </td>
                          <td>Joseph Dole</td>
                          <td>Supplier</td>
                          <td>88998</td>
                          <td className="text-success">Delivered</td>
                          <td>$4,582.39</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* End:Advanced Table */}
            </div>
          </div>
        </div>
        {/* End:Main Body */}
      </div>

      {/* Offcanvas Toggler */}
      <button
        className="d2c_offcanvas_toggle position-fixed top-50 start-0 translate-middle-y d-block d-lg-none"
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
