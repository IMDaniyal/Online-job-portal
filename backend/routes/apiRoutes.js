const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Application = require("../db/Application");

const router = express.Router();

// get all users
router.get("/users", jwtAuth, (req, res) => {  
  const regex = new RegExp(req.query.q, 'i') // i for case insensitive
  let findParams = {
    skills: {$regex: regex},
  };
  findParams = {"$or":[
    {...findParams},
    {name: {$regex: regex},},
    {education: {$elemMatch :{degreeTitle: {$regex: regex}}}},
    {experience: {$elemMatch :{jobTitle: {$regex: regex}}}},
    {certification: {$elemMatch :{certificationTitle: {$regex: regex}}}}
  ]
  };

  JobApplicant.aggregate([
    {
      $lookup: {
        from: "applications",
        localField: "userId",
        foreignField: "userId",
        as: "application",
      },
    },
    { $match: findParams },
  ])
    .then((applications) => {
      if (applications.length === 0) {
        res.status(404).json({
          message: "No applicants found",
        });
        return;
      }
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });

});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update user details
router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.experience) {
          jobApplicant.experience = data.experience;
        }
        if (data.certification) {
          jobApplicant.certification = data.certification;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        if (data.languages) {
          jobApplicant.languages = data.languages;
        }
        if (data.resume) {
          jobApplicant.resume = data.resume;
        }
        if (data.profile) {
          jobApplicant.profile = data.profile;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// create application [todo: test: done]
router.post("/user/:id/applications", jwtAuth, (req, res) => {
  console.log("IN APIIII")
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to apply for a job",
    });
    return;
  }
  const data = req.body;
  console.log(data, user)

  Recruiter.findOne({
    userId: user._id,
  })
  .then((recruiter) => {
    Application.findOne({
      userId: data.userId,
      recruiterId: recruiter.userId,
      status: {
        $nin: ["accepted", "cancelled"],
      },
    })
    .then((appliedApplication) => {
      console.log("RECRUITERSSSS APPLICATIONS",appliedApplication);
      if (appliedApplication !== null) {
        res.status(400).json({
          message: "You have already sent invite",
        });
        return;
      }
        console.log("During APPLICATION IN API");
        const application = new Application({
          user: data,
          userId: data.userId,
          recruiter: recruiter,
          recruiterId: recruiter.userId,
          status: "invited",
        });
        console.log("APPLICATION IN API", application);
        application
          .save()
          .then(() => {
            res.json({
              message: "Job application successful",
            });
            console.log("SuCESSFUL IN API", application);
          })
          .catch((err) => {
            console.log("ERRO IN API", err);
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.json(400).json(err);
      });
    })
    .catch((err) => {
      res.json(400).json(err);
    });
});

// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to view job applications",
    });
    return;
  }
  const jobId = req.params.id;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    // .skip(skip)
    // .limit(limit)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  // "applied", // when a applicant is applied
  // "shortlisted", // when a applicant is shortlisted
  // "accepted", // when a applicant is accepted
  // "rejected", // when a applicant is rejected
  // "deleted", // when any job is deleted
  // "cancelled", // an application is cancelled by its author or when other application is accepted
  // "finished", // when job is over
  if (user.type === "recruiter") {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Application status cannot be updated",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else if (status === "screening") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "You don't have permissions to update job status",
      });
    }
  }
});

// get a list of final applicants for all his appplications : recuiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      { $match: findParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        const checkStatus = obj => obj.status !== 'invited';
        res.json(applications.filter(checkStatus));
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

module.exports = router;
