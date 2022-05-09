import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Grid } from "@material-ui/core";

const MyDocument = ({ application }) => {
    return( // 
  <Document>
    <Page size="A4">
      <View>
        <Text style={{ padding: "8px", textAlign: "center" }}>{application.name}'s CV</Text>
        <Grid item style={{ marginBottom: "8px" }}>
            <Text>Name: {application.name}</Text>
        </Grid>
        {application.education.length > 0 &&
            <Text style={{ padding: "8px" }}> Education</Text>
        }
        {application.education.map((obj, key) => (
            <Grid item container key={key} style={{ marginBottom: "8px" }}>
                <Text>Institution Name: {obj.institutionName}</Text>
                <Text>Degree Title: {obj.degreeTitle}</Text>
            </Grid>
        ))}
        {application.experience.length > 0 &&
            <Text style={{ padding: "8px" }}> Experience</Text>
        }
            {application.experience.map((obj, key) => (
            <Grid item container key={key} style={{ marginBottom: "8px" }}>
                <Text>Company Name: {obj.companyName}</Text>
                <Text>Job Title: {obj.jobTitle}</Text>
            </Grid>
        ))}
      </View>
    </Page>
  </Document>
);
}

export default MyDocument;