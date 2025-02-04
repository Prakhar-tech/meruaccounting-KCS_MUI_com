import React, { useContext, useState, useRef, useEffect } from "react";
import { Paper, Typography, TextField, Link } from "@mui/material";
import EdiText from "react-editext";
import SearchBar from "../SearchBar";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import { ClientsContext } from "../../contexts/ClientsContext";
import { projectContext } from "../../contexts/ProjectsContext";
import { getClient } from "../../api/clients api/clients";
import {
  editProject,
  deleteProject,
  addProjectLeader,
} from "../../api/projects api/projects";
import EnhancedTable from "../Projects/ProjectMemers";
import { Link as RouterLink } from "react-router-dom";
import moment from "moment";
import { useSnackbar } from "notistack";
//---------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  input: {
    color: "#000",
    width: "fit-content",
    maxWidth: "50%",
    wordWrap: "break-word",
    height: "30px",
    fontSize: "30px",
    fontWeight: "bold",
    border: "none",
    background: "#fff",
    transition: "width 0.4s ease-in-out",
    "& :focus": { width: "100%" },
  },
}));
export default function Header(props) {
  const {
    // currentClient,
    // currentProject,
    clientsList,
    setcurrentProject,
    setcurrentClient,
    ...other
  } = props;

  const classes = useStyles();
  // to focus edit name of client
  const inputRef = useRef();
  //context
  const {
    clients,
    currentClient,
    currentProject,
    changeClient,
    changeProject,
    updateClient,
    clientDetails,
    dispatchClientDetails,
  } = useContext(ClientsContext);
  const {
    dispatchEditProject,
    dispatchDeleteProject,
    dispatchaddProjectLeader,
    editedProject,
  } = useContext(projectContext);
  const [ProjectLeader, setProjectLeader] = useState("");
  const [projectName, setprojectName] = useState("");
  const [budgetTime, setbudgetTime] = useState();
  const [consumedTime, setconsumedTime] = useState();
  const outerref = useRef();
  const proInputRef = useRef("");
  const { enqueueSnackbar } = useSnackbar();

  const handleEditClick = (e) => {
    inputRef.current.focus();
  };
  const test = useRef(false);
  const clientIndex = clientsList?.findIndex(
    (i) => i._id === currentClient?._id
  );
  const projectIndex = clientsList[clientIndex]?.projects?.findIndex(
    (i) => i._id === currentProject?._id
  )
    ? clientsList[clientIndex]?.projects?.findIndex(
        (i) => i._id === currentProject?._id
      )
    : "";
  useEffect(async () => {
    if (clientsList !== null || undefined) {
      await changeClient(clientsList[clientIndex]);
      await changeProject(clientsList[clientIndex]?.projects[projectIndex]);
    }
  }, [clientDetails]);
  console.log(currentProject);
  useEffect(() => {
    try {
      currentProject
        ? setprojectName(`${currentProject.name}`)
        : setprojectName("No Client Select");
      currentProject?.projectLeader
        ? setProjectLeader(
            `${currentProject?.projectLeader?.firstName} ${currentProject?.projectLeader?.lastName}`
          )
        : setProjectLeader("No leader");
      setbudgetTime(currentProject?.budgetTime);
      setconsumedTime(currentProject?.consumeTime);
      proInputRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  }, [clientDetails, currentClient, currentProject]);

  let memberList = [];
  let membersData = [];
  currentProject
    ? currentProject.employees.map((emp) => {
        membersData.push({
          dayArray: emp.days,
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          payRate: emp.payRate,
        });
        memberList.push(`${emp.firstName} ${emp.lastName}`);
      })
    : memberList.push("");
  const handleSearch = async (e, value) => {
    try {
      e.preventDefault();
      const emp = membersData.filter((emp) =>
        emp.name === value ? emp.id : ""
      );
      const data = [currentProject._id, emp[0].email];
      await addProjectLeader(data, dispatchaddProjectLeader);
      const employee = memberList.filter((emp) => (emp === value ? emp : ""));
      setProjectLeader(employee);
      proInputRef.current.value = "";
      console.log(proInputRef.current);

      enqueueSnackbar("Project Leader changed", { variant: "success" });
    } catch (error) {
      console.log(error.message);
      enqueueSnackbar(error.message, { variant: "warning" });
    }
  };
  const handleEdit = () => {};
  const handleEditSubmit = async (e) => {
    try {
      e.preventDefault();
      await editProject(
        currentProject._id,
        { name: projectName },
        dispatchEditProject
      );
      await getClient(dispatchClientDetails);
      // changeProject(curr);
      enqueueSnackbar("Project name changed", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "warning" });
    }
  };
  const handleProjectDelete = async (e) => {
    try {
      const clientIndex = clientsList?.findIndex(
        (i) => i._id === currentClient?._id
      );
      const projectIndex = clientsList[clientIndex]?.projects?.findIndex(
        (i) => i._id === currentProject._id
      );
      const lastIn = clientsList[clientIndex]?.projects?.indexOf(
        clientsList[clientIndex]?.projects?.slice(-1)[0]
      )
        ? clientsList[clientIndex]?.projects?.indexOf(
            clientsList[clientIndex]?.projects?.slice(-1)[0]
          )
        : 0;
      const data = { projectId: `${currentProject._id}` };

      if (clientIndex === 0 && projectIndex === 0) {
        changeProject(clientsList[clientIndex].projects[projectIndex + 1]);
      } else if (
        projectIndex === lastIn &&
        projectIndex === 0 &&
        clientIndex !== 0
      ) {
        changeClient(clientsList[clientIndex - 1]);
        changeProject(clientsList[clientIndex - 1].projects.slice(-1)[0]);
      } else if (clientIndex === 0 && projectIndex === lastIn) {
        changeClient(clientsList[clientIndex + 1]);
        changeProject(clientsList[clientIndex + 1].projects[0]);
      } else {
        changeProject(clientsList[clientIndex].projects[projectIndex + 1]);
      }
      await deleteProject(currentProject._id, dispatchDeleteProject);
      await getClient(dispatchClientDetails);
      enqueueSnackbar("Project deleted", { variant: "success" });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.message, { variant: "warning" });
    }
  };
  const handleConsumeSave = () => {};
  const handleSave = async (v) => {
    console.log(v);
    try {
      await editProject(
        currentProject._id,
        { budgetTime: v },
        dispatchEditProject
      );
      setbudgetTime(v);
      await getClient(dispatchClientDetails);
      // changeProject(curr);
      enqueueSnackbar("Budget time changed", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "warning" });
    }
  };

  return currentProject === undefined ? (
    <Box
      component="div"
      sx={{
        width: "70%",
        flexGrow: "1",
        overflowX: "auto",
        overflowY: "auto",
        margin: "10px 10px 10px 0",
      }}
    >
      <Paper
        component="div"
        elevation={3}
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          ml: 1,
          overflow: "visible",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/svgs/project.svg"
          sx={{ width: 100, height: 70, backgroundColor: "white" }}
        />
        <Typography variant="h5">No Project Selected</Typography>
      </Paper>
    </Box>
  ) : (
    <>
      <Box
        ref={outerref}
        component="div"
        sx={{
          width: "70%",
          flexGrow: "1",
          overflowX: "hidden",
          overflowY: "auto",
          m: 1,
        }}
      >
        {/* grid container 40 60 */}
        <Paper
          component="div"
          elevation={3}
          sx={{
            overflow: "visible",
            height: "100%",
            position: "relative",
            display: "grid",
            gridTemplateRows: "30% 70%",
          }}
        >
          <Box sx={{ m: 1 }}>
            <div></div>
            <h3 style={{ backgroundColor: "#fff" }}>
              <form onSubmit={handleEditSubmit} style={{ display: "inline" }}>
                <input
                  onChange={(e) => setprojectName(e.target.value)}
                  type="text"
                  ref={inputRef}
                  className={classes.input}
                  value={projectName}
                />
              </form>

              <div
                style={{
                  float: "right",
                }}
              >
                {/* <button
                  type="button"
                  style={{ marginRight: "5px" }}
                  
                > */}
                <EditIcon onClick={handleEditClick} sx={{ mr: 2 }} />
                {/* </button> */}
                {/* <button type="button" style={{}}> */}
                <DeleteIcon onClick={handleProjectDelete} />
                {/* </button> */}
              </div>
            </h3>
            <Typography
              variant="h4"
              sx={{
                mt: 2,
                display: "block",
                width: "100%",
              }}
            >
              Project Leader
            </Typography>
            <div
              style={{
                width: "100%",
                float: "left",
                paddingTop: "20px",
                display: "flex",
                // justifyContent: "left",
                marginLeft: "2px",
              }}
            >
              <Paper
                // variant="h4"
                sx={{
                  textAlign: "center",
                  color: "primary.darker",
                  fontSize: "25px",
                  width: 150,
                  mt: 2,
                  mr: 2,
                }}
              >
                {ProjectLeader}
              </Paper>

              <SearchBar
                inputRef={proInputRef}
                label="Assign Project Leader"
                handleSearch={handleSearch}
                id="combo-box-demo"
                options={memberList}
                sx={{ width: 100 }}
              />
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
              }}
            >
              <Paper sx={{ pt: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="h6"
                    sx={{ ml: 1, display: "flex", alignItems: "center" }}
                  >
                    Total Project Hours :
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <EdiText
                      sx={{ display: "flex", alignItems: "center", pl: 1 }}
                      type="number"
                      value={consumedTime}
                      onCancel={(v) => console.log("CANCELLED: ", v)}
                      onSave={(v) => handleConsumeSave(v)}
                    />
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={{ pt: 1, ml: 1 }}>
                    Total Internal Hours :
                  </Typography>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", mr: 6, pt: 1 }}
                  >
                    {currentProject?.internalHours
                      ? currentProject?.internalHours
                      : 0}
                  </Typography>
                </Box>
              </Paper>
              <Paper>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", flexDirection: "row", pt: 3 }}
                >
                  <Typography
                    variant="h6"
                    style={{
                      display: "inherit",
                      alignItems: "center",
                    }}
                  >
                    BudgetHours :{" "}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <EdiText
                      sx={{ display: "flex", alignItems: "center", pl: 1 }}
                      type="number"
                      value={budgetTime}
                      onCancel={(v) => console.log("CANCELLED: ", v)}
                      onSave={(v) => handleSave(v)}
                    />
                  </Typography>
                </Typography>
              </Paper>
            </div>

            <Paper elevation={2} sx={{ pt: 1 }}>
              <hr />

              <EnhancedTable
                clientsList={clientsList}
                currentProject={currentProject}
                currentClient={currentClient}
                outerref={outerref}
              />
            </Paper>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
