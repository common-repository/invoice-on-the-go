<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit33854426a6be069a29483e6d280f2074
{
    public static $prefixLengthsPsr4 = array (
        'T' => 
        array (
            'Twig\\' => 5,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Twig\\' => 
        array (
            0 => __DIR__ . '/..' . '/twig/twig/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'T' => 
        array (
            'Twig_' => 
            array (
                0 => __DIR__ . '/..' . '/twig/twig/lib',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit33854426a6be069a29483e6d280f2074::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit33854426a6be069a29483e6d280f2074::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit33854426a6be069a29483e6d280f2074::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
