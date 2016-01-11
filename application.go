package main

import (
	"./twitter"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"log"
	"net/http"
	"strconv"
)

const PAGE_TITLE = "pushArray(com)"

var (
	twttr    = twitter.NewTwitter()
	tmpl     = *template.Must(template.New("main").ParseGlob("templates/*.html"))
	tmplVars = make(map[string]string)
)

func tweetMaxIdHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	maxId := vars["maxId"]
	count, _ := strconv.ParseInt(vars["count"], 10, 64)
	if count == 0 {
		count = 10
	}
	slice := twttr.GetMaxId(maxId, int(count))
	js, err := json.Marshal(twttr.ToBasicTweets(slice))
	if err != nil {
		fmt.Println("Error parsing JSON.")
	}
	w.Write(js)
}

func allTweetsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	count, _ := strconv.ParseInt(vars["count"], 10, 0)
	if count == 0 {
		count = int64(len(twttr.Tweets))
	}
	js, err := json.Marshal(twttr.ToBasicTweets(twttr.Tweets[0:count]))
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
	tmplVars["Title"] = PAGE_TITLE
	router := mux.NewRouter()
	router.HandleFunc("/", indexHandler)
	router.HandleFunc("/tweets/{maxId}/{count}", tweetMaxIdHandler)
	router.HandleFunc("/tweets/{count}", allTweetsHandler)
	router.HandleFunc("/tweets/", allTweetsHandler)
	http.Handle("/", router)
	handleStatic(router, []string{"static"})
	log.Println("Listening at 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
