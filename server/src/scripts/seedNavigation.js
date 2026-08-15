import { connectDB }
  from "../config/database.js";

import Navigation
  from "../models/Navigation.model.js";

const seedNavigation =
  async () => {
    try {
      await connectDB();

      await Navigation.deleteMany(
        {}
      );

      const home =
        await Navigation.create({
          label: "Home",
          path: "/",
          order: 1,
          menuType: "INTERNAL",
        });

      const about =
        await Navigation.create({
          label: "About",
          path: "/about",
          order: 2,
          menuType: "INTERNAL",
        });


        await Navigation.create({
  label: "Mission Objectives",
  path: "/about/mission-objectives",
  parentId: about._id,
  order: 1,
  menuType: "INTERNAL",
});

await Navigation.create({
  label: "DG Desk",
  path: "/about/dg-desk",
  parentId: about._id,
  order: 2,
  menuType: "INTERNAL",
});

await Navigation.create({
  label: "Director Desk",
  path: "/about/director-desk",
  parentId: about._id,
  order: 3,
  menuType: "INTERNAL",
});

const csirLabs =
  await Navigation.create({
    label: "CSIR Laboratories",

    path: "#",

    order: 3,

    menuType: "INTERNAL",
  });

      await Navigation.create({
        label:
          "Nodal Laboratory",

        path:
          "/csir-laboratories/nodal-lab",

        parentId:
          csirLabs._id,

        order: 1,

        menuType:
          "INTERNAL",
      });

      await Navigation.create({
        label:
          "Participating Laboratories",

        path:
          "/csir-laboratories/participating-labs",

        parentId:
          csirLabs._id,

        order: 2,

        menuType:
          "INTERNAL",
      });

      await Navigation.create({
        label:
          "CSIR Smart Village",

        path:
          "/csir-smart-village",

        order: 4,

        menuType:
          "INTERNAL",
      });

      await Navigation.create({
        label:
          "News & Updates",

        path:
          "/news-updates",

        order: 5,

        menuType:
          "INTERNAL",
      });

      await Navigation.create({
        label:
          "Success Stories",

        path:
          "/success-stories",

        order: 6,

        menuType:
          "INTERNAL",
      });

      await Navigation.create({
        label:
          "Our Supporters",

        path:
          "/our-supporters",

        order: 7,

        menuType:
          "INTERNAL",
      });
      await Navigation.create({
        label:
          "Contact Us",

        path:
          "/contact",

        order: 8,

        menuType:
          "INTERNAL",
      });

      console.log(
        "✅ Navigation Seeded Successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedNavigation();