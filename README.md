Black
=====

Provides functionality missing from the core JavaScript library, for the
basic object types.


### Downloading

Black is hosted (and developed) on [Github][]. You can
[download the lastest snapshot][snapshot] or clone the entire
repository:

    $ git clone git://github.com/killdream/black.git
    
[Github]: https://github.com/killdream/black
[snapshot]: https://github.com/killdream/black/zipball/master
    
    
### Usage

After loading the black modules, you can use their methods directly:

    >>> var obj = require('black').obj
    >>> obj.items(obj)
    [ ['keys', [Function: keys] ]
    , ['values', [Function: values] ]
    , ['items', [Function: items] ]
    , ... ]
    
    >>> obj.emptyp(obj)
    false
    
    >>> obj.emptyp({ })
    true
    
    >>> obj.size(obj)
    14
    
By loading the `core` module, you can unpack the methods to use them in
a nice way:

    >>> var black = require('black')
    
    >>> black.unpack_all(['utils'])
    
    // all methods marked as utilities are now in the global scope
    >>> keys(black)
    [ 'unpack', 'unpack_all', 'obj', ... ]
    
    // You can also unpack utilities to a different object
    >>> black.unpack_all(['utils'], _ = { })
    >>> _.keys(black)
    [ 'unpack', 'unpack_all', 'obj', ... ]
    
    // By unpacking the generic methods, you get all methods burned in
    // the respective built-in. So black.obj.emptyp goes to
    // Object.emptyp and so on
    >>> black.unpack_all(['utils', 'generic'])
    >>> Object.size(black.obj)
    14
    
    // By unpacking the own methods, you get all methods as instance
    // methods, burned in their respective built-in prototypes.
    >>> black.unpack_all(['utils', 'method'])
    >>> black.obj.size()
    14
    
    // You can get more control on the unpacking by calling the
    // underlying `unpack' method directly. For example, you could
    // unpack the generic black.obj methods in a custom object, and the
    // own methods in this custom object's prototype.
    >>> var $ = Object.create({ })
    >>> black.unpack(['generic', 'method'], global, $, $.__proto__, black.obj)
    >>> $.size($)
    14
    
    >>> var $$ = Object.create($.__proto__)
    >>> $$.emptyp()
    true
    



### The build system
    
#### Pre-requisites
    
Black uses [Jakefiles][Jake] for build tasks. If you want them, you'll need:
    
* [UglifyJS][]     - the minifier tool;
* [Jake][]         - the build tool;
* [NodeJS][]       - for running the build tool;
    
**Note:**

> You'll need UglifyJS 1.0.2+, since the previous versions frowned upon
> form feeds. 
    
[Jake]:     https://github.com/mde/jake
[UglifyJS]: https://github.com/mishoo/UglifyJS
[NodeJS]:   https://nodejs.org

    
#### Listing the available tasks
   
To get a list of all available tasks:
    
    $ jake --tasks
    
To filter the task list, for example, to get all tasks that contain `foo`:
    
    $ jake --tasks foo
    
Or just the usual:    

    $ jake --tasks | grep foo


#### Building

To build both the distribution scripts and documentation:

    $ jake build

Individual things are placed inside the `build` namespace. You can just
`jake --tasks build` from the command line to get a list of them.


### Documentation

You can build the actual documentation using:

    $ jake build:docs

Also, the source code should be pretty well documented using OrpheOS's
`calliope` documentation conventions. If you see functionality that miss
documentation on why it exists, the implications of using it, or that
just aren't explained well, please file a bug report :3


### Support

-  Use the [Github tracker][tracker] to report bugs and/or request
   features.

-  Fork, do your changes and send me a delicious pull request for added
   awesomeness.
   
-  You can also find me on [Twitter][] or just [email me][] directly.
      
[tracker]: https://github.com/killdream/black/issues
[Twitter]: http://twitter.com/notSorella
[email me]: mailto:quildreen@gmail.com
      
      
### Licence
      
Black is licensed under the delicious and permissive [MIT][] licence. you
can happily copy, share, modify, sell or whatever — refer to the actual
licence text for `less` information:
      
    $ less LICENCE.txt
    
[MIT]: https://github.com/killdream/black/raw/master/LICENCE.txt
    
