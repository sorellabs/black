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
    
