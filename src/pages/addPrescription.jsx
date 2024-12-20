import React, { useEffect, useRef, useState } from "react";
import { useGetPrescriptions } from "../hook/useGetPrescriptions";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetDoctorProfile } from "../hook/useGetDoctorProfile";
import { useGetListMedichine } from "../hook/useGetListMedicine";
import { useSnackbar } from "notistack";
import { apiFetch } from "../lib/apiFetch";

function AddPrescription() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const ref = useRef({ current: false });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { data } = useGetPrescriptions(appointmentId);
  const { data: doctor } = useGetDoctorProfile();
  const { data: listMedicines } = useGetListMedichine();
  const [prescriptionList, setPrescriptionList] = useState([
    {
      medicineId: 0,
      name: "",
      dosage: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setPrescriptionList(data.prescriptionDTO);
    }
    ref.current = true;
  }, [data]);

  const handleSavePrescription = async () => {
    try {
      setIsLoading(true);
      console.log(prescriptionList);
      const { data, status } = await apiFetch(
        `/appointments/${appointmentId}/prescription`,
        {
          method: "POST",
          body: JSON.stringify(
            prescriptionList.filter((e) => e.medicineId !== 0)
          ),
        }
      );
      if (!status) {
        throw new Error(data);
      }
      enqueueSnackbar("Tạo thành công", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    setPrescriptionList([
      ...prescriptionList,
      { medicineId: 0, dosage: "", name: "", description: "" },
    ]);
  };

  const handleRemovePrescription = (index) => {
    const updatedList = prescriptionList.filter((_, i) => i !== index);
    setPrescriptionList(updatedList);
  };

  const handleUpdatePrescription = (index, key, value) => {
    const updatedList = prescriptionList.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setPrescriptionList(updatedList);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-12 col-12">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/Home">Trang Chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Thêm Đơn Thuốc
                  </li>
                </ol>
              </nav>
              <h2 className="breadcrumb-title">Thêm Đơn Thuốc</h2>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Page Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              {/* Profile Widget */}
              <div className="card widget-profile pat-widget-profile">
                <div className="card-body">
                  <div className="pro-widget-content">
                    <div className="profile-info-widget">
                      <a href="#" className="booking-doc-img">
                        <img
                          src="assets/img/patients/patient.jpg"
                          alt="Hình Ảnh Người Dùng"
                        />
                      </a>
                      <div className="profile-det-info">
                        <h3>
                          <a href="/patientProfile">{data?.username}</a>
                        </h3>
                        <div className="patient-details">
                          <h5 className="mb-0">
                            <i className="fas fa-map-marker-alt"></i>{" "}
                            {data?.address}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="patient-info">
                    <ul>
                      <li>
                        Điện Thoại <span>{data?.phoneNumber}</span>
                      </li>
                      <li>{/* Tuổi <span>38 Năm, Nam</span> */}</li>
                      <li>{/* Nhóm Máu <span>AB+</span> */}</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Profile Widget */}
            </div>

            <div className="col-md-7 col-lg-8 col-xl-9">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title mb-0">Thêm Đơn Thuốc</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="biller-info">
                        <h4 className="d-block">{doctor?.doctorName}</h4>
                        <span className="d-block text-sm text-muted">
                          {doctor?.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add Item */}
                  <div className="add-more-item text-right">
                    <a
                      href="javascript:void(0);"
                      onClick={handleAddPrescription}
                    >
                      <i className="fas fa-plus-circle"></i> Thêm Mục
                    </a>
                  </div>
                  {/* /Add Item */}

                  {/* Prescription Item */}
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="table-responsive">
                        {/* <table className="table table-hover table-center">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "200px" }}>Tên</th>
                              <th style={{ minWidth: "100px" }}>Mô tả</th>
                              <th style={{ minWidth: "80px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <select className="form-control select">
                                  {listMedicines &&
                                    listMedicines.map((e) => (
                                      <option key={e.name} value={e.name}>
                                        {e.name}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td>
                                <input className="form-control" type="text" />
                              </td>

                              <td>
                                <a
                                  href="#"
                                  className="btn bg-danger-light trash"
                                >
                                  <i className="far fa-trash-alt"></i>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table> */}
                        <table className="table table-hover table-center">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "200px" }}>Tên</th>
                              <th style={{ minWidth: "100px" }}>Mô tả</th>
                              <th style={{ minWidth: "100px" }}>Liều dùng</th>
                              <th style={{ minWidth: "80px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptionList.map((prescription, index) => (
                              <tr key={index}>
                                <td>
                                  <select
                                    className="form-control select"
                                    value={prescription.medicineId}
                                    onChange={(e) =>
                                      handleUpdatePrescription(
                                        index,
                                        "medicineId",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn thuốc</option>
                                    {listMedicines &&
                                      listMedicines.map((medicine) => (
                                        <option
                                          key={medicine.medicineId}
                                          value={medicine.medicineId}
                                        >
                                          {medicine.name}
                                        </option>
                                      ))}
                                  </select>
                                </td>
                                <td>
                                  <textarea readOnly value={prescription.description} style={{width: "100%"}}/>
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    value={prescription.dosage}
                                    onChange={(e) =>
                                      handleUpdatePrescription(
                                        index,
                                        "dosage",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <a
                                    href="#"
                                    className="btn bg-danger-light trash"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemovePrescription(index);
                                    }}
                                  >
                                    <i className="far fa-trash-alt"></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* /Prescription Item */}

                  {/* Submit Section */}
                  <div className="row">
                    <div className="col-md-12">
                      <div className="submit-section">
                        <button
                          type="submit"
                          className="btn btn-primary submit-btn"
                          onClick={handleSavePrescription}
                        >
                          Lưu
                        </button>
                        <button
                          type="reset"
                          className="btn btn-secondary submit-btn"
                          onClick={() => {
                            navigate("/doctorDashboard");
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* /Submit Section */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
}

export default AddPrescription;
