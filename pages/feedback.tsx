// @ts-nocheck
import React, { useEffect } from "react";
import MainLayout from "../components/MainLayout";

const BoardToken = "e259c290-ef77-d4b1-f38a-d6eab50d34b3";

const Feedback = () => {
  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          (e.type = "text/javascript"),
            (e.async = !0),
            (e.src = "https://canny.io/sdk.js"),
            f.parentNode.insertBefore(e, f);
        }
      }
      if ("function" != typeof w.Canny) {
        var c = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          "complete" === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent("onload", l)
            : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");

    Canny("render", {
      boardToken: BoardToken,
      basePath: "/feedback", // See step 2
      ssoToken: null, // See step 3,
      theme: "light", // options: light [default], dark, auto
    });
  }, []);
  return (
    <div className="relative col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="my-3 text-3xl font-bold text-center sm:text-4xl text-slate-900">
        We want to hear your ideas!
      </h1>
      <h2 className="pb-16 text-xl font-medium text-center ">
        Vote on the features you want to see, or add your own ideas.
      </h2>
      <div className="relative">
        <div data-canny />
      </div>
    </div>
  );
};

export default Feedback;

Feedback.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Feedback | Lesson Robot</title>
      </Head>
      {page}
    </MainLayout>
  );
};
