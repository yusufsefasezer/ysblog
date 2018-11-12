document.addEventListener('DOMContentLoaded', function () {

  var sidenav = M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  var parallax = M.Parallax.init(document.querySelectorAll('.parallax'), {
    responsiveThreshold: Infinity
  });
  var scrollspy = M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {});

});