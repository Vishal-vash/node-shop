exports.get404ErrorPage = (req, res, next) => {
    res.render('404', {docTitle: 'Page Not Found', path: '404'})
}