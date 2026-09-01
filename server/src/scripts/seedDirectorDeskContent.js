import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedDirectorDeskContent =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug:
            "director-desk",
        });

      const sections =
        await PageSection.find({
          pageId: page._id,
        });

      for (const section of sections) {

        switch (
          section.sectionType
        ) {

          case "PROFILE_HERO":
            section.content = {
              heading:
                "Director's Desk",

              subHeading:
                "Message from the Director, CSIR-CBRI",
            };
            break;

          case "PROFILE_MESSAGE":
            section.content = {
              name:
                "Dr. Director Name",

              designation:
                "Director, CSIR-CBRI",

              image:
  "https://images.unsplash.com/photo-1560250097-0b93528c311a",

              message:
                "Welcome to the CSIR SMART Village Mission. Through innovation, technology and community participation we aim to create sustainable and inclusive rural development models for India.",
            };
            break;

          case "PROFILE_BIO":
            section.content = {
              heading:
                "Biography",

              description:
                ` Education
Doctor of Philosophy, Earthquake Engineering (2001)
University of Tokyo, Tokyo, Japan
Master of Technology, Structural Engineering (1997)
Indian Institute of Technology, Kanpur, India
Bachelor of Engineering, Civil Engineering (1995)
Vasavi College of Engineering (Osmania University), Hyderabad, India
His research interests are earthquake safety assessment and retrofitting of buildings. He has developed the Applied Element Method (AEM) to solve crack initiation and propagation in near-fault rupture phenomenon and reduced computation time. He has extended this method to study collapse behavior of structures subjected to blast loading.

Launched at IIITH, the M.Tech and Ph.D programs in Structural Engineering in 2002. Established Earthquake Engineering Research Centre, one of its kind in India, working for solutions to India specific problems. He has supervised 10 Ph.D. and 16 M.S. students, and presently supervising 10 PhD students. He has published ~120 papers in national and international journals.

Crusading towards increasing the critical mass in earthquake engineers in India through large- scale self-supported outreach activity. In last 15 years alone, he along with his Ph.D. students trained over 1000 Civil Engineering undergraduate students in earthquake engineering.

He has collected the data of ~50,000 buildings from across 60 cities/towns in India. He has developed a new methodology for documenting Housing Typologies and estimating Earthquake Disaster Risk Index of cities. Currently, this Indexing method is adopted by the National Disaster Management Authority (NDMA) for ranking cities across the nation to understand their relative risk profiles towards launching Disaster Management initiatives. Also, he has undertaken vulnerability assessment of buildings for many state governments and 6 major ports in Gujarat.

He has been Member of Post-Earthquake Reconnaissance Teams (including of the National Disaster Management Authority, Government of India), which surveyed earthquake affected areas after 2001 Bhuj, 2004 Sumatra, 2011 Sikkim, 2013 Doda and 2015 Nepal earthquakes. This has led to the development of housing typologies and realistic assessment of housing in India.

Is a Panel Member of IS:456 and IS:1343 (CED2), and Members of the Earthquake Engineering Sectional (CED39) and National Building Code (CED 46) Committees and contributed to development of two earthquake standards IS:1893 and IS:13920. He is Panel Chair for developing Code on Post- Earthquake Damage Assessment of Buildings.

Has been an able administrator, as Registrar of IIITH, and resolving critical human issues with relative ease, because he commands affection and respect of most employees of the Institute. Many Institutes and colleges across India are seeking his guidance owing to this leadership in administration.

Awards and recognitions
Outstanding Concrete Engineer award from Indian Concrete Institute, 2021
Young Scientist Award from ICI, 2011
Commendation certiﬁcate from Indian Embassy, Japan, 2001
Monbusho Fellowship for studies in Japan, 1998
University topper in Civil Engineering, 1995, topper in Diploma (1992), topper in School (1988)
Notable Contribution towards Universal Human Values
Professor Pradeep is strong proponent of Universal Human Values in Higher Education. He has spear headed the activity of human values in IIIT-H during 2005-2022.

Leading deep personal efforts to bring to focus Human Values in Technical Education since 2005. He successfully persuaded the State Governments (especially of Telangana and Andhra Pradesh) to introduce a compulsory course on Human Values at the undergraduate level in over 3,000 colleges. Till now, he has conducted over 150 workshops (FDPs) of 1-8 days’ duration and delivered over 300 Guest Lectures on Universal Human Values. He has reached over 10 lakh people through his lectures and workshops on Universal Human Values.

As a Member of the AICTE Curriculum Revision Committee, contributed towards introduction of 3- week student induction program (SIPs) for students joining Technical Institutes. He was also instrumental in UGC’s Deeksharambh programs for students joining degree colleges. Also, he contributed to the preparation of Teachers’ Manual for the above induction programs.

Professor R. Pradeep Kumar is a good researcher, an exceptional teacher, and a fine human being. His scientific efforts to estimate earthquake risk in various cities across India is nationally acclaimed and used by the National Disaster Management Authority (Government of India).`,
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ Director Desk Content Seeded"
      );

      process.exit(0);

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

seedDirectorDeskContent();
