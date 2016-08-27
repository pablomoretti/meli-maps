#!/home/Desarrollo/pmoretti/bin/groovy

@Grab(group="org.codehaus.gpars", module="gpars", version="0.11")
@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.7')
 
import groovyx.net.http.RESTClient
import groovyx.gpars.GParsPool
import groovy.io.*
import groovyx.net.http.*
import java.lang.StringBuilder
import java.util.concurrent.atomic.AtomicInteger
import static groovyx.net.http.ContentType.*


def stopwords = new File("stopwords.csv").text


def removeStopWords(list,stopwords){

	return list.findAll{
		if (it.size() < 4 || it.size() > 50){
			return false;
		}
		else if (stopwords.contains(it)){
			return false;
		}else{
			return true;
		}
	}
}


def restclient(){
	return new RESTClient( "https://api.mercadolibre.com");
}

def listTextQuestion(itemId){
	def client = new RESTClient( "https://api.mercadolibre.com");

	def response =  client.get(path:"/questions/search",'query':['item_id':itemId])

	if(response.status == 200){
		return response.data.questions.collect { it.text.toLowerCase().replaceAll('\\.|,|\\?|\\!','') }
	}
	else{
		return [];
	}

}

def listItemIds(search){
	def client = new RESTClient( "https://api.mercadolibre.com")

	def response =  client.get(path:"/sites/MCO/search",'query':['q':search,'limit':200])

	if(response.status == 200){
		return response.data.results.collect { it.id }
	}
	else{
		return [];
	}

}


def items = listItemIds("camaras seguridad");


def joinQuestions = []

GParsPool.withPool(30) { 

	items.eachParallel { item ->

		def tempList = listTextQuestion(item);

		synchronized (joinQuestions) {
			joinQuestions = joinQuestions + tempList;
		}
	}

}

def keywords = []

joinQuestions.each{
	keywords.addAll(removeStopWords(it.split(' '),stopwords));
}

keywords.each{
	println it;
}


//def map = keywords.countBy { it };

//map = map.sort{ it.value }

