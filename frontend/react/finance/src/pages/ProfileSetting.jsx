import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ProfileSetting() {
    let userId = 0;

    //DECODE TOKEN TO GET USERID
    const token = localStorage.getItem("access_token");
    if (token) {
        const tokenDecoded = jwtDecode(token);
        userId = tokenDecoded.user_id;
    }

    const handleUpdateClient = async (data) => {
        const formated = {
            name: data.name,
            email: data.email,
            password: data.password,
        };

        try {
        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formated),
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar transação");
            toast.error("Erro ao atualizar os dados");
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

    return (
        <div className="col-xl-12 mb-4">
            <div className="card">
                <div className="card-header">
                    <h5>Edit data</h5>
                </div>
                <div className="card-body">
                    <form action={handleUpdateClient} class="d2c_rounded_form">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input
                                    type="name"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="José Silva"
                                    />
                                    <label htmlFor="floatingInput">Name</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    />
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    />
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>

                                <div class="mb-3">
                                    <button type="submit" class="btn btn-primary text-capitalize">Submit</button>
                                    <a href="/dashboard" class="btn btn-outline-primary text-capitalize ms-2">Cancel</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}