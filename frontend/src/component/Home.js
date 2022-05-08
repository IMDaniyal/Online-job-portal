import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Avatar,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../App";

import apiList, { server } from "../lib/apiList";

import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, getData } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openEndJob, setOpenEndJob] = useState(false);
  const [openProfileView, setProfileView] = useState(false);

  const appliedOn = new Date(application.dateOfApplication);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEndJob = () => {
    setOpenEndJob(false);
  };

  const handleCloseProfileView = () => {
    setProfileView(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  const getResume = () => {
    console.log("RESUMEE", application);
    if (
      application.resume &&
      application.resume !== ""
    ) {
      const address = `${server}${application.resume}`;
      console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };

  const handleApply = () => {
    axios
      .post(
        `${apiList.user}/${application._id}/applications`,
        application,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleCloseEndJob();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseEndJob();
      });
  };


  const updateStatus = (status) => {
    const address = `${apiList.applications}/${application._id}`;
    const statusData = {
      status: status,
      dateOfJoining: new Date().toISOString(),
    };
    axios
      .put(address, statusData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleCloseEndJob();
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
        handleCloseEndJob();
      });
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid
          item
          xs={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${server}${application.profile}`}
            className={classes.avatar}
          />
        </Grid>
        <Grid container item xs={7} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">
              {application.name}
            </Typography>
          </Grid>
          <Grid item>
            {application.skills.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item style={{ paddingBottom: "2px" }}>
            <Button
              variant="contained"
              className={classes.statusBlock}
              disabled={!application.resume || application.resume === ""}
              color="primary"
              onClick={() => getResume()}
            >
              Download Resume
            </Button>
          </Grid>
          <Grid item style={{ paddingBottom: "2px" }}>
            <Button
              variant="contained"
              className={classes.statusBlock}
              color="primary"
              onClick={() => setProfileView(true)}
            >
              View User Profile
            </Button>
          </Grid>
          <Grid item container xs>
            <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              style={{
                background: "#09BC8A",
              }}
              onClick={() => {
                setOpenEndJob(true);
              }}
            >
              Invite for the screening
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={openEndJob}
        onClose={handleCloseEndJob}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => {
                  handleApply();
                }}
              >
                Yes
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseEndJob()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal
        style={{overflow:'scroll', display:'block', right:'10%', left:'10%'}}
        open={openProfileView}
        onClose={handleCloseProfileView}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "16px", textAlign: "center"}}>{application.name}'s CV</Typography>
          <Grid container direction="column" alignItems="stretch" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                value={application.name}
                className={classes.inputBox}
                variant="outlined"
                inputProps={
                  { readOnly: true, }
                }
                fullWidth
              />
            </Grid>
            {application.education.length > 0 &&
              <Typography variant="h6" style={{ padding: "8px" }}> Education</Typography>
            }
            {application.education.map((obj, key) => (
              <Grid item container className={classes.inputBox} key={key}>
                <Grid item xs={4}>
                  <TextField
                    label={`Institution Name #${key + 1}`}
                    value={obj.institutionName}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={`Degree Title`}
                    value={obj.degreeTitle}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="Start Year"
                    value={obj.startYear}
                    variant="outlined"
                    type="number"
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label={obj.endYear? "End Year": ""}
                    value={obj.endYear? obj.endYear: "present"}
                    variant="outlined"
                    type={obj.endYear? "number":""}
                    inputProps={
                      { readOnly: true, }
                    }
                    />
                </Grid>
              </Grid>
            ))}
            {application.experience.length > 0 &&
              <Typography variant="h6" style={{ padding: "8px" }}> Experience</Typography>
            }
             {application.experience.map((obj, key) => (
              <Grid item container className={classes.inputBox} key={key}>
                <Grid item xs={4}>
                  <TextField
                    label={`Company Name #${key + 1}`}
                    value={obj.companyName}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={`Job Title`}
                    value={obj.jobTitle}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="Start Year"
                    value={obj.startYear}
                    variant="outlined"
                    type="number"
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                <TextField
                    label={obj.endYear? "End Year": ""}
                    value={obj.endYear? obj.endYear: "present"}
                    variant="outlined"
                    type={obj.endYear? "number":""}
                    inputProps={
                      { readOnly: true, }
                    }
                    />
                </Grid>
              </Grid>
            ))}
            {application.skills.length > 0 &&
              <Grid item>
                  <ChipInput
                    className={classes.inputBox}
                    label="Skills"
                    variant="outlined"
                    value={application.skills}
                    style={{ margin: "4px" }}
                    fullWidth
                    disabled
                    readOnly
                    inputProps={
                      { readOnly: true, }
                    }
                  />
              </Grid>
            }
            {application.languages.length > 0 &&
              <Grid item>
                  <ChipInput
                    className={classes.inputBox}
                    label="Languages"
                    variant="outlined"
                    value={application.languages}
                    style={{ margin: "4px" }}
                    fullWidth
                    disabled
                    readOnly
                  />
              </Grid>
            }
            {application.certification.length > 0 &&
              <Typography variant="h6" style={{ padding: "8px" }}> Certifications</Typography>
            }
            {application.certification.map((obj, key) => (
              <Grid item container className={classes.inputBox} key={key}>
                <Grid item xs={6}>
                  <TextField
                    label={`Certificiation Title #${key + 1}`}
                    value={obj.certificationTitle}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label={`Issued By`}
                    value={obj.issuedBy}
                    variant="outlined"
                    fullWidth
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="Valid Till"
                    value={obj.validTill}
                    variant="outlined"
                    type="number"
                    inputProps={
                      { readOnly: true, }
                    }
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
          
          <Grid item style={{ padding: "8px", marginTop: "12px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleCloseProfileView()}
            >
              Close
            </Button>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Home = (props) => {
  const [applications, setApplications] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    searchParams = [...searchParams];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = `${apiList.users}`;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("USERSSS",response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response);
        // console.log(err.response.data);
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Candidates</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Skills"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px", marginBottom: "20px" }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item>
                <ApplicationTile application={obj} getData={getData} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Applications Found
            </Typography>
          )}
        </Grid>
        {/* <Grid item>
          <Pagination count={10} color="primary" />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Home;
