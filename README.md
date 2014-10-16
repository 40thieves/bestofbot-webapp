## BestOf Bot Web App

### Web app showing best moments of DTNS, tracked by the best of bot

Web app for displaying the best of moments of [Daily Tech News Show](http://dailytechnewsshow.com). Powered by [bestofbot IRC bot](https://github.com/40thieves/bestofbot).

Listens for `!b` messages in the [irc.dtns.tv](http://irc.dtns.tv) chatroom, calculates the relative timestamp to the video start and stores in a MongoDB database. Best of moments are shown at [bestofbot.40thiev.es](http://dtns.bestofbot.com), starting at the correct time.

### Installation

* `git clone git@github.com:40thieves/bestofbot.git`
* `npm install`

### Building assets

Assets (only [Bootstrap](http://getbootstrap.com/) at the moment) are provided by [Bower](http://bower.io). Download the assets by running:

`gulp bower`

Then build the Sass with:

`gulp sass`

### Usage

#### Starting the bot and server

Start the bot listening to the chat room and start the web server by running:

`gulp dev`

### License

(The MIT License)

Copyright &copy; 2014 Alasdair Smith, [http://alasdairsmith.org.uk](http://alasdairsmith.org.uk)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


