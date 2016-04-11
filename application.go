package main

import (
	"./twitter"
	"encoding/json"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

const PAGE_TITLE = "pushArray(com)"

var (
	client   = twitter.NewTwitter()
	tmpl     = *template.Must(template.New("main").ParseGlob("templates/*.html"))
	tmplVars = make(map[string]string)
)

func tweetsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	count, _ := strconv.ParseInt(vars["count"], 10, 0)
	if count == 0 {
		count = int64(len(client.Tweets))
	}
	js, err := json.Marshal(twitter.ToBasicTweets(client.Tweets[0:count]))
	if err != nil {
		log.Fatal(err)
	}
	w.Write(js)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl.ExecuteTemplate(w, "index.html", tmplVars)
}

func handleStatic(r *mux.Router, p []string) {
	for _, path := range p {
		name := "/" + path + "/"
		r.PathPrefix(name).Handler(
			http.StripPrefix(name, http.FileServer(http.Dir(path+"/"))))
	}
}

func main() {
	go client.GetTweets()
	go twitter.PollTweets(&client)
	tmplVars["Title"] = PAGE_TITLE
	router := mux.NewRouter()
	router.Queries("maxId", "count", "userId")
	router.HandleFunc("/", indexHandler)
	router.HandleFunc("/tweets", tweetsHandler)
	http.Handle("/", router)
	handleStatic(router, []string{"static"})
	log.Println("Listening at 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
