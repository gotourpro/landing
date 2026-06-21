import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './components/not-found/not-found.component';
import { PageLayout } from './components/layout/enums/page-layout.enum';
import { setLayout } from './components/layout/services/page-layout-resolve.service';
import { ErrorPageComponent } from './components';

export const routes: Routes = [
  {
    path: '', loadComponent: () =>
      import("./components/home/components/home/home.component").then(
        (c) => c.HomeComponent
      ),
    resolve: {
      layout: setLayout(PageLayout.Public)
    },
  },
  {
    path: 'about', loadComponent: () =>
      import("./components/about/components/about/about.component").then(
        (c) => c.AboutComponent
      ),
    resolve: {
      layout: setLayout(PageLayout.Public),

    },

  },
  {
    path: 'privacy-policy', loadComponent: () =>
      import("./components/privacy-policy/privacy-policy.component").then(
        (c) => c.PrivacyPolicyComponent
      ),
    resolve: {
      layout: setLayout(PageLayout.Public),

    },

  },
  {
    path: 'terms-and-conditions', loadComponent: () =>
      import("./components/terms-and-conditions/terms-and-conditions.component").then(
        (c) => c.TermsAndConditionComponent
      ),
    resolve: {
      layout: setLayout(PageLayout.Public),

    },

  },
  // {
  //   path: "blog",
  //   resolve: {
  //     layout: setLayout(PageLayout.Public),

  //   },
  //   children: [
  //     {
  //       path: "",
  //       loadComponent: () =>
  //         import("./components/blog/components/blog-list/blog-list.component").then(
  //           (c) => c.BlogListComponent
  //         ),
  //     },
  //     {
  //       path: ":slug",
  //       loadComponent: () =>
  //         import("./components/blog/components/blog-details/blog-details.component").then(
  //           (c) => c.BlogDetaislComponent
  //         ),
  //     },
  //   ],
  // },
  {
    path: "blog",
    resolve: {
      layout: setLayout(PageLayout.Public)
    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "./components/blog/components/blog-list/blog-list.component"
          ).then(c => c.BlogListComponent)
      },
      {
        path: "category/:slug",
        loadComponent: () =>
          import(
            "./components/blog/components/blog-list/blog-list.component"
          ).then(c => c.BlogListComponent)
      },
      {
        path: ":slug",
        loadComponent: () =>
          import(
            "./components/blog/components/blog-details/blog-details.component"
          ).then(c => c.BlogDetaislComponent)
      }
    ]
  },
  {
    path: "tours",
    resolve: {
      layout: setLayout(PageLayout.Public)
    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import(
            "./components/tours/components/tour-list/tour-list.component"
          ).then(c => c.TourListComponent)
      },
      {
        path: "category/:slug",
        loadComponent: () =>
          import(
            "./components/tours/components/tour-list/tour-list.component"
          ).then(c => c.TourListComponent)
      },
      {
        path: ":slug",
        loadComponent: () =>
          import(
            "./components/tours/components/tour-details/tour-details.component"
          ).then(c => c.TourDetailsComponent)
      }
    ]
  },
  {
    path: "destinations",
    resolve: {
      layout: setLayout(PageLayout.Public),

    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./components/destinations/components/destination-list/destination-list.component").then(
            (c) => c.DestinationListComponent
          ),
      },
      {
        path: ":slug",
        loadComponent: () =>
          import("./components/destinations/components/destination-details/components/destination-details/destination-details.component").then(
            (c) => c.DestinationDetailsComponent
          ),
      },
    ],
  },
  {
    path: 'faq', loadComponent: () =>
      import("./components/faq/components/faq/faq.component").then(
        (c) => c.FaqComponent
      ), resolve: {
        layout: setLayout(PageLayout.Public)
      },

  },
  {
    path: 'contact', loadComponent: () =>
      import("./components/contact/components/contact/contact.component").then(
        (c) => c.ContactComponent
      ), resolve: {
        layout: setLayout(PageLayout.Public)
      },

  },
  {
    path: '404', loadComponent: () =>
      import("./components/error-page/error-page.component").then(
        (c) => c.ErrorPageComponent
      ), resolve: {
        layout: setLayout(PageLayout.Public)
      },
  },

  {
    path: 'cookie-policy', loadComponent: () =>
      import('./components/cookie-policy/cookie-policy.component')
        .then(
          (c) => c.CookiePolicyComponent), resolve: {
            layout: setLayout(PageLayout.Public)
          },
  },
  {
    path: 'disclaimer',
    loadComponent: () =>
      import('./components/disclaimer/disclaimer.component')
        .then(m => m.DisclaimerComponent),
    resolve: {
      layout: setLayout(PageLayout.Public)
    },
  },
  { path: '**', redirectTo: '/404' }

];

export const routing = RouterModule.forRoot(routes);

