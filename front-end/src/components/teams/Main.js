import * as React from "react";
import { useContext, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  styled,
  Paper,
  Link,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Switch,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import EdiText from "react-editext";
import { convertString } from "../../contexts/UserContext";
import { getFullName } from "src/_helpers/getFullName";
import { employeeUpdate } from "src/api/employee api/employee";
import { getTeam, removeMember } from "src/api/teams api/teams";
import { employeeContext } from "src/contexts/EmployeeContext";
import { projectContext } from "src/contexts/ProjectsContext";
import { teamContext } from "src/contexts/TeamsContext";
import { settingsValueToString } from "src/_helpers/settingsValuetoString";
import { removeProjectMember } from "src/api/projects api/projects";
import { UserContext } from "../../contexts/UserContext";
import { useSnackbar } from "notistack";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Main(props) {
  const {
    currTeam,
    currMember,
    setMember,
    setCurrTeam,
    teamsDetails,
    ...other
  } = props;
  const { dispatchEmployeeUpdate } = useContext(employeeContext);
  const { dispatchRemoveMember, dispatchgetTeam, updatedMember, getTeams } =
    useContext(teamContext);
  const { changeTab } = useContext(UserContext);
  const { dispatchremoveProjectMember } = useContext(projectContext);
  const [Checked, setChecked] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const handleLabelChange = (event) => {
    setChecked(event.target.checked);
    console.log(event.target.checked);
  };

  useEffect(() => {
    try {
      console.log(currTeam?._id, currMember._id);
      const teamIndex = teamsDetails?.findIndex((i) => i._id === currTeam?._id);
      const memberIndex = teamsDetails[teamIndex]?.members?.findIndex(
        (i) => i._id === currMember?._id
      );
      console.log(teamIndex, memberIndex, "hello");
      if (teamsDetails !== null) {
        setCurrTeam(teamsDetails[teamIndex]);
        setMember(teamsDetails[teamIndex]?.members[memberIndex]);
      }
    } catch (err) {
      console.log(err);
    }
  }, [getTeams]);

  //Updating payrate of an employee
  const updatePayrate = async (value) => {
    try {
      const data = {
        payRate: value,
      };
      await employeeUpdate(currMember._id, data, dispatchEmployeeUpdate);
      await getTeam(dispatchgetTeam);
      enqueueSnackbar("Payrate updated", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "info" });
      console.log(err);
    }
  };

  //Updating role of Employee
  const updateRole = async (e) => {
    try {
      const data = {
        role: e.target.value,
      };
      console.log(data);
      await employeeUpdate(currMember._id, data, dispatchEmployeeUpdate);
      await getTeam(dispatchgetTeam);
      enqueueSnackbar("Role updated", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "info" });
      console.log(err);
    }
  };

  //Changing status of an employee
  const updateStatus = async (value) => {
    try {
      const data = {
        status: value,
      };
      console.log(data);
      await employeeUpdate(currMember?._id, data, dispatchEmployeeUpdate);
      await getTeam(dispatchgetTeam);
      enqueueSnackbar("Employee updated", { variant: "success" });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.message, { variant: "info" });
    }
  };

  //Deleting a member from a team
  const deleteMember = async () => {
    try {
      const data = {
        employeeId: currMember._id,
        teamId: currTeam._id,
      };
      console.log(data);
      await removeMember(data, dispatchRemoveMember);
      await getTeam(dispatchgetTeam);
      enqueueSnackbar("Member removed", { variant: "success" });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.message, { variant: "info" });
    }
  };

  //Removing employee from a project
  const removeProject = async (value) => {
    try {
      const data = {
        id: currMember._id,
        projectId: value,
      };
      console.log(data);
      await removeProjectMember(data, dispatchremoveProjectMember);
      await getTeam(dispatchgetTeam);
      enqueueSnackbar("Project removed ", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "info" });
      console.log(err);
    }
  };

  //Searching a project
  const handleChange = (e, value) => {
    if (value) {
      const id = value._id;
      window.location.href = "#" + id;
    }
  };

  //Remove employee from all projects
  const removeAllProject = async () => {
    try {
      for (var i = 0; i < currMember.projects.length; i++) {
        const data = {
          id: currMember._id,
          projectId: currMember.projects[i]._id,
        };
        console.log(data);
        await removeProjectMember(data, dispatchremoveProjectMember);
      }
      await getTeam(dispatchgetTeam);

      enqueueSnackbar("All project removed ", { variant: "success" });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(err.message, { variant: "info" });
    }
  };

  const Labelconfig = function () {
    console.log(currMember.settings);
    return (
      <>
        {currMember.projects.map((pro) => (
          <FormControlLabel
            id={`${pro._id}`}
            sx={{ display: "block", pt: 1, fontWeight: 10 }}
            onClick={() => removeProject(pro._id)}
            control={<Switch defaultChecked />}
            label={`${pro.name}`}
          />
        ))}
      </>
    );
  };

  return currMember === null ? (
    <Box
      component="div"
      sx={{
        height: "100%",
        width: "100%",
        flexGrow: "1",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src="/svgs/member.svg"
        sx={{ width: 100, height: 70, backgroundColor: "white" }}
      />
      <Typography variant="h5">No Member Selected</Typography>
    </Box>
  ) : (
    <>
      {/* <Button
        onClick={() => (
          <>
            {setMember()}
            {console.log(currMember)}{" "}
          </>
        )}
      >
        click me
      </Button> */}

      {currMember && (
        <Container
          component="div"
          sx={{ height: "auto" }}
          role="tabpanel"
          id={`vertical-tabpanel`}
          aria-labelledby={`vertical-tab`}
          {...other}
        >
          <Typography sx={{ overflow: "auto" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                sx={{ display: "flex", justifyContent: "space-between" }}
                spacing={0}
              >
                <Grid xs={4}>
                  <RouterLink
                    to={`/dashboard/employeepage/${currMember._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography sx={{ fontSize: 40 }}>
                      {getFullName(currMember?.firstName, currMember?.lastName)}
                    </Typography>
                  </RouterLink>
                  <Divider />
                  <Typography variant="body1">{currMember?.email}</Typography>
                  {currMember.status !== "archived" && (
                    <Grid xs={8} sx={{ mt: 2 }}>
                      <Typography variant="h4">Payrate</Typography>
                      <EdiText
                        type="number"
                        value={`${currMember.payRate}`}
                        onCancel={(v) => console.log("CANCELLED: ", v)}
                        onSave={(v) => updatePayrate(v)}
                      />
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ padding: 1, display: "flex" }}>
                  <Box>
                    <Typography
                      sx={{
                        padding: 1,
                        backgroundColor: "error.main",
                        color: "white",
                        borderRadius: 1,
                        display: `${
                          currMember.status === "null" ? "none" : ""
                        }`,
                      }}
                    >
                      {currMember.status}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{ padding: 1 }}
                      onClick={(e) => {
                        if (currMember.status === "paused") {
                          updateStatus("null");
                        } else {
                          updateStatus("paused");
                        }
                      }}
                    >
                      {currMember.status === "paused" ? (
                        <Link>
                          <PlayArrowIcon sx={{ fontSize: "small" }} />
                          UnPause
                        </Link>
                      ) : (
                        <Link>
                          <PauseIcon sx={{ fontSize: "small" }} />
                          Pause
                        </Link>
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ padding: 1 }} onClick={deleteMember}>
                      <Link>
                        <DeleteIcon sx={{ fontSize: "small" }} /> Delete
                      </Link>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{ padding: 1 }}
                      onClick={(e) => {
                        if (currMember.status === "archived") {
                          updateStatus("null");
                        } else {
                          updateStatus("archived");
                        }
                      }}
                    >
                      {currMember.status === "archived" ? (
                        <Link>
                          <RestorePageIcon sx={{ fontSize: "small" }} />
                          Restore
                        </Link>
                      ) : (
                        <Link>
                          <ArchiveIcon sx={{ fontSize: "small" }} />
                          Archive
                        </Link>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Box>
            {currMember.status !== "archived" && (
              <>
                {currMember.role === "admin" && (
                  <Box sx={{ mt: 2 }}>
                    <FormControl component="fieldset" sx={{ pt: 2 }}>
                      <Typography variant="h4">
                        Role({currMember.role})
                      </Typography>
                      <RadioGroup
                        aria-label="Role"
                        value={currMember.role}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="admin"
                          control={<Radio onChange={updateRole} />}
                          label="Admin - full control over Team, Projects & Settings. Does not have access to owner's My Account page settings."
                        />
                        <FormControlLabel
                          value="manager"
                          control={<Radio onChange={updateRole} />}
                          label="Manager - can see selected user's Timeline & Reports (but not rates)"
                        />
                        <FormControlLabel
                          value="employee"
                          control={<Radio onChange={updateRole} />}
                          label="Employee - can see their own data only"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}
                {currMember.role === "admin" && (
                  <Box>
                    <Typography variant="h5">Manage for</Typography>
                    <Typography varinat="body2">
                      If enabled,
                      {getFullName(currMember.firstName, currMember.lastName)}
                      will be able to see selected user's Timeline and Reports,
                      but not rates.
                    </Typography>
                    <Typography varinat="h6">
                      {/* {User.map((user) => (
                    <FormControlLabel
                      sx={{ pt: 1, fontWeight: 10 }}
                      control={<Switch />}
                      label={user.name}
                    />
                  ))} */}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ pt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h5">Projects</Typography>
                    <Autocomplete
                      id="combo-box-demo"
                      options={currMember.projects}
                      getOptionLabel={(option) => option.name}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Project" />
                      )}
                      onChange={handleChange}
                    />
                  </Box>
                  {/* <Link sx={{ pr: 1 }}>Add all</Link> */}
                  <Link sx={{ pl: 1 }} onClick={removeAllProject}>
                    Remove all
                  </Link>
                  <Container sx={{ display: "block" }}>
                    {Labelconfig()}
                  </Container>
                </Box>
                <Box sx={{ pt: 2, fontSize: "20px" }}>
                  <Typography variant="h4">Effective Settings</Typography>
                  {currMember.settings &&
                    Object.keys(currMember.settings).map(
                      (keyName, keyIndex) => (
                        <>
                          <Box
                            key={keyName}
                            sx={{ display: "flex", flexDirection: "rows" }}
                          >
                            <Typography
                              varihant="h6"
                              sx={{ pr: 2, fontSize: "20px", color: "success" }}
                            >
                              {convertString(keyName)}
                            </Typography>
                            <RouterLink
                              onClick={() => {
                                console.log(keyIndex);
                                changeTab(keyIndex - 1);
                              }}
                              to="/dashboard/settings"
                              sx={{ pr: 1 }}
                            >
                              {currMember.settings[keyName].isTeamSetting
                                ? settingsValueToString(
                                    currMember.settings[keyName].teamValue
                                  )
                                : settingsValueToString(
                                    currMember.settings[keyName].individualValue
                                  )}
                            </RouterLink>
                          </Box>
                        </>
                      )
                    )}
                </Box>
              </>
            )}
          </Typography>
        </Container>
      )}
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node,
};
