Work in progress.

# gm-ebus
Experimental state management solution. 

[![Build Status](https://travis-ci.org/mariangibala/gm-ebus.svg?branch=master)](https://travis-ci.org/mariangibala/gm-ebus)

## Why?

Trying to connect good parts of Flux and MVC. Contrary to pure Flux implementations, store setters are acceptable here for synchronous data manipulation within store context. Actions are used for async calls (for example network requests) and when an event is handled by multiple stores. 

![gm-ebus](/img/gm-ebus.png?raw=true)





