// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";

const TododAPP = () => {
  const [data, setData] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [tableData, setTableData] = useState([]);
  const [isEdit, setIsEdit] = useState("");
  const [editData, setEditData] = useState({
    time: "",
    activity: "",
    status: "",
  });
  const [isCreate, setIsCreate] = useState(false);
  const [createData, setCreateData] = useState({
    time: "",
    activity: "",
    status: "New",
  });

  let dropdownValues = ["New", "InProgress", "Completed"];

  

  const onChangeDate = (event) => {
    setData(moment(event.target.value).format("yyyy-MM-DD"));
  };

  const getAllActivites = async () => {
    try {
      const res = await axios.post(
        "https://todoapp-production-b5d4.up.railway.app/todoApp/findAllTodoForTheDay",
        { date: data }
      );
      setTableData(res?.data);
    } catch (err) {}
  };

  useEffect(() => {
    console.log("useEffect")
    getAllActivites();
  }, []);
  
  const onsubmit = async () => {
    console.log(createData, "createData");
    try {
      const res = await axios.post(
        "https://todoapp-production-b5d4.up.railway.app/todoApp/createTodoActivity",
        { ...createData, date: data }
      );
      getAllActivites();
    } catch (err) {}
    setIsCreate(false);
  };

  const UpdateStatus = async (id) => {
    console.log(editData, "editData");
    try {
      const res = await axios.put(
        "https://todoapp-production-b5d4.up.railway.app/todoApp/updateTodo",
        { ...editData, date: data, id }
      );
      getAllActivites();
      setIsEdit("");
    } catch (err) {}
  };

  const removeTodoActivity = async (id) => {
    console.log(id, "removeTodoActivity");
    try {
      const res = await axios.delete(
       `https://todoapp-production-b5d4.up.railway.app/todoApp/removeTodo/`+id
      );
      getAllActivites();
    } catch (err) {}
  };
console.log("ren der")
  return (
    <div width="200px">
      <br />
      <span>Date: </span>
      <input
        id="tododate"
        type="date"
        value={data}
        name="date"
        onChange={(e) => onChangeDate(e)}
      />
      <br />
      <button
        style={{ marginTop: "40px" }}
        onClick={() => {
          setIsCreate(true);
        }}
      >
        Create
      </button>

      {isCreate && (
        <dialog open>
          Time:{" "}
          <input
            type="time"
            id="time"
            step="1"
            value={createData.time}
            onChange={(e) => {
              setCreateData({ ...createData, time: e.target.value });
            }}
          />
          <br />
          Activity Name:{" "}
          <input
            type="text"
            id="activity"
            value={createData.activity}
            onChange={(e) => {
              setCreateData({ ...createData, activity: e.target.value });
            }}
          />
          <br />
          Status:{" "}
          <select
            name="status"
            id="status"
            onChange={(e) => {
              setCreateData({ ...createData, status: e.target.value });
            }}
          >
            {dropdownValues?.map((x, i) => {
              return <option key={i} value={x}>{x}</option>;
            })}
          </select>
          <br />
          <button onClick={() => onsubmit()}>Submit</button>
        </dialog>
      )}

      <div width="100%" style={{ marginTop: "40px" }}>
        <table border="1px solid black" style={{ display: "inline-block" }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Activities</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((x, id) => {
              return (
                <tr key={id}>
                
                  {isEdit === id ? (
                    <>
                      <td>
                        <input
                          type="time"
                          id="time"
                          step="1"
                          value={editData.time}
                          onChange={(e) => {
                            setEditData({
                              ...editData,
                              time: e.target.value,
                            });
                          }}
                        />
                      </td>
                      <td>
                      <input
                        type="text"
                        id="activity"
                        value={editData.activity}
                        onChange={(e) => {
                          setEditData({
                            ...editData,
                            activity: e.target.value,
                          });
                        }}
                      />
                      </td>
                      <td>
                        <select
                          name="status"
                          id="status"
                          value={editData.status}
                          onChange={(e) => {
                            setEditData({
                              ...editData,
                              status: e.target.value,
                            });
                          }}
                        >
                          {dropdownValues?.map((x, i) => {
                            return <option value={x}>{x}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <button
                          id={id}
                          onClick={(e) => {
                            setIsEdit("");
                          }}
                        >
                          Cancel
                        </button>
                        <button id={id} onClick={(e) => UpdateStatus(x.id)}>
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                    <td>{x.time}</td>
                    <td>{x.activity}</td>
                      <td>{x.status}</td>
                      <td>
                        <button
                          id={id}
                          onClick={(e) => {
                            console.log("id", id);
                            setIsEdit(id);
                            setEditData({
                              time: x.time,
                              activity: x.activity,
                              status: x.status,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button id={id} onClick={()=>{removeTodoActivity(x.id)}}>Remove</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TododAPP;
