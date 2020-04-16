const COOKIE='VARIANT?';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


async function handleRequest(request) {
  let url;
  let cookieName=getCookie(request);

  if(cookieName!=null) {
    url=cookieName;
  }
  else {
     url=await fetchMainURL() 
     var date = new Date();
    date.setTime(date.getTime() + (5 * 60 * 60 * 1000));
     var cookieString = `${COOKIE}=${url};Expires=${date.toGMTString()};Secure; HttpOnly`;
  }
  
  let data = await fetchText(url)
  let response = new Response(data, {
    headers: { 'content-type': 'text/html'},
  });
  let innerHTMLChanged = await renderHTML(response)

  if (cookieName == null) {
    innerHTMLChanged.headers.set('Set-Cookie', cookieString)
  }
   
  return innerHTMLChanged;
}


 function getCookie(request) {
  let initialCookie=null;
  let allCookies=request.headers.get('Cookie');
  if(allCookies) {
    let cookiesArray=allCookies.split(';');
    cookiesArray.map(cookie=>{
      let cookie_0=cookie.split('=')[0].trim();
      if(cookie_0==COOKIE) {
        let cookie_1=cookie.split('=')[1];
        initialCookie=cookie_1;
      }
    })
  }
 console.log(initialCookie);
  return initialCookie;
}


async function fetchMainURL() {
  var JSONURL ='https://cfw-takehome.developers.workers.dev/api/variants';
  let response = await fetch(JSONURL);
  let JSONdata = await response.json();
  var array=[];
 array.push(JSONdata.variants[0]);
 array.push(JSONdata.variants[1]);
 var randomNumber=Math.floor(Math.random()*array.length);
  return array[randomNumber];
}




async function fetchText(url) {
  let result = await fetch(url)
  return result.text()
}
 


class Title {
  element(element) {
    console.log(`Incoming element1: ${element.tagName}`)
    element.setInnerContent('Workers Internship Application')
  }
}

class Heading{
  element(element) {
    console.log(`Incoming element2: ${element.tagName}`)
    element.setInnerContent('Ritik Garg')
  }
}
class Paragraph{
  element(element) {
    console.log(`Incoming element3: ${element.tagName}`)
    element.setInnerContent('Workers Internship Application')
  }
}

class Link {
  element(element) {
    const attribute = element.getAttribute('href')
    if (attribute) {
      element.setAttribute('href',attribute.replace('https://cloudflare.com', 'https://www.google.co.in/')
      )
    }
    element.setInnerContent('Go to Google')
  }
}

// Changing copy/URLs
async function renderHTML(data) {
  return new HTMLRewriter().on('title', new Title())
  .on('h1#title',new Heading())
  .on('p#description',new Paragraph())
  .on('a#url', new Link('href'))
  .transform(data)
}
