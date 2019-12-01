module.exports = {
  siteMetadata: {
    title: `TabWise`,
    description: `Scan it, Say it, Split it.`,
    author: `TabWise`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `TabWise - Scan it, Say it, Split it`,
        short_name: `TabWise`,
        start_url: `/`,
        background_color: `#273c75`,
        theme_color: `#273c75`,
        display: `standalone`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `lato\:300,400,700` // you can also specify font weights and styles
        ],
        display: 'swap'
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
