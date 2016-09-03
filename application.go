package main

import (
	"./twitter"
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

const pageTitle = "pushArray(com)"

var (
	client   = twitter.NewTwitter()
	tmpl     = *template.Must(template.New("main").ParseGlob("templates/*.html"))
	tmplVars = make(map[string]string)
)

func tweetsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	vars := r.URL.Query()
	count, _ := strconv.ParseInt(vars.Get("count"), 10, 0)
	if count == 0 {
		count = int64(len(client.Tweets))
	}
	js, err := json.Marshal(twitter.ToBasicTweets(client.Tweets[0:count]))
	if err != nil {
		log.Fatal(err)
	}
	w.Write(js)
}

func indexHandler(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	tmpl.ExecuteTemplate(w, "index.html", tmplVars)
}

func main() {
	go client.GetTweets()
	go twitter.PollTweets(&client)
	tmplVars["Title"] = pageTitle
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.GET("/tweets", tweetsHandler)
	router.ServeFiles("/static/*filepath", http.Dir("static"))
	log.Println("Listening at 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
