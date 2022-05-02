import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const EducationfieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={4}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={`Degree Title`}
              value={education[key].degreeTitle}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].degreeTitle = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                degreeTitle: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const ExperiencefieldInput = (props) => {
  const classes = useStyles();
  const { experience, setExperience } = props;

  return (
    <>
      {experience.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={4}>
            <TextField
              label={`Company Name #${key + 1}`}
              value={experience[key].companyName}
              onChange={(event) => {
                const newExp = [...experience];
                newExp[key].companyName = event.target.value;
                setExperience(newExp);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={`Job Title`}
              value={experience[key].jobTitle}
              onChange={(event) => {
                const newExp = [...experience];
                newExp[key].jobTitle = event.target.value;
                setExperience(newExp);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newExp = [...experience];
                newExp[key].startYear = event.target.value;
                setExperience(newExp);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newExp = [...experience];
                newExp[key].endYear = event.target.value;
                setExperience(newExp);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setExperience([
              ...experience,
              {
                companyName: "",
                jobTitle: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another work experience
        </Button>
      </Grid>
    </>
  );
};

const CertificationsfieldInput = (props) => {
  const classes = useStyles();
  const { certification, setCertification } = props;

  return (
    <>
      {certification.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={6}>
            <TextField
              label={`Certificiation Title #${key + 1}`}
              value={certification[key].certificationTitle}
              onChange={(event) => {
                const newCert = [...certification];
                newCert[key].certificationTitle = event.target.value;
                setCertification(newCert);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={`Issued By`}
              value={certification[key].issuedBy}
              onChange={(event) => {
                const newCert = [...certification];
                newCert[key].issuedBy = event.target.value;
                setCertification(newCert);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Valid Till"
              value={obj.validTill}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newCert = [...certification];
                newCert[key].validTill = event.target.value;
                setCertification(newCert);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setCertification([
              ...certification,
              {
                certificationTitle: "",
                issuedBy: "",
                validTill: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another certification
        </Button>
      </Grid>
    </>
  );
};

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    certification: [],
    experience: [],
    skills: [],
    languages: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      degreeTitle: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      companyName: "",
      jobTitle: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [certification, setCertification] = useState([
    {
      certificationTitle: "",
      issuedBy: "",
      validTill: "",
    },
  ]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              degreeTitle: edu.degreeTitle ? edu.degreeTitle : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
        if (response.data.experience.length > 0) {
          setExperience(
            response.data.experience.map((exp) => ({
              companyName: exp.companyName ? exp.companyName : "",
              jobTitle: exp.jobTitle ? exp.jobTitle : "",
              startYear: exp.startYear ? exp.startYear : "",
              endYear: exp.endYear ? exp.endYear : "",
            }))
          );
        }
        if (response.data.certification.length > 0) {
          setCertification(
            response.data.certification.map((cert) => ({
              certificationTitle: cert.certificationTitle ? cert.certificationTitle : "",
              issuedBy: cert.issuedBy ? cert.issuedBy : "",
              validTill: cert.validTill ? cert.validTill : "",
            }))
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editDetails = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    console.log(education);
    console.log(experience);
    console.log(certification);

    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .filter((obj) => obj.degreeTitle.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
      experience: experience
        .filter((obj) => obj.companyName.trim() !== "")
        .filter((obj) => obj.jobTitle.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
      certification: certification
        .filter((obj) => obj.certificationTitle.trim() !== "")
        .filter((obj) => obj.issuedBy.trim() !== ""),
    };
    
    console.log("DETAILS !!!!", updatedDetails);
    axios
      .put(apiList.user, updatedDetails, {
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
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
    setOpen(false);
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
        <Grid item>
          <Typography variant="h2">Profile</Typography>
        </Grid>
        <Grid item xs>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Typography variant="h6" style={{ padding: "8px" }}> Education</Typography>
              <EducationfieldInput
                education={education}
                setEducation={setEducation}
              />
              <Typography variant="h6" style={{ padding: "8px" }}>Work Experience</Typography>
              <ExperiencefieldInput
                experience={experience}
                setExperience={setExperience}
              />
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills}
                  style={{ margin: "4px" }}
                  onAdd={(chip) =>
                    setProfileDetails({
                      ...profileDetails,
                      skills: [...profileDetails.skills, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let skills = profileDetails.skills;
                    skills.splice(index, 1);
                    setProfileDetails({
                      ...profileDetails,
                      skills: skills,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Languages"
                  variant="outlined"
                  helperText="Press enter to add languages"
                  value={profileDetails.languages}
                  style={{ margin: "4px" }}
                  onAdd={(chip) =>
                    setProfileDetails({
                      ...profileDetails,
                      languages: [...profileDetails.languages, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let languages = profileDetails.languages;
                    languages.splice(index, 1);
                    setProfileDetails({
                      ...profileDetails,
                      languages: languages,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Typography variant="h6" style={{ padding: "8px" }}>Certifications</Typography>
              <CertificationsfieldInput
                certification={certification}
                setCertification={setCertification}
              />
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Resume (.pdf)"
                  icon={<DescriptionIcon />}
                  uploadTo={apiList.uploadResume}
                  handleInput={handleInput}
                  identifier={"resume"}
                />
              </Grid>
              <Grid item>
                <FileUploadInput
                  className={classes.inputBox}
                  label="Profile Photo (.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"profile"}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Update Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* <Modal open={open} onClose={handleClose} className={classes.popupDialog}> */}

      {/* </Modal> */}
    </>
  );
};

export default Profile;
