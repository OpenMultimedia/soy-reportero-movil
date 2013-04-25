Setup del ambiente para desarrollo
---------------
Clonar repositorio

    $ git clone ...

Instalar Ruby 1.9 (Recomendado: 1.9.3)

    $ sudo apt-get install ruby1.9.3 (En debian Wheezy)

Instalar RubyGem Bundler

    $ sudo gem install bundler

Instalar gemas dependientes ejecutando en raiz del proyecto

    $ bundle install

Copiar src/www al directorio correspondiente al dispositivo

    [iphone]
    $ cp -r src/www src/ios/
    (Android)
    $ cp -r src/www src/android/assets/
    (Blackberry)
    ----
    (Windows Phone 7)
    ----

Para compilar/desplegar en Android:

Ejecutar en la raiz del proyecto:
    
    $ bundle exec rake android[debug,true,true]

(Compilar para android, en modo debug, instalar y ejecutar usando adb)
