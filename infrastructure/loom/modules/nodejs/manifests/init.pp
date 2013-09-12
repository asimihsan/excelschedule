class nodejs {
    class prepare {
        class { 'apt': }
        apt::ppa { 'ppa:chris-lea/node.js': }
    }
    include prepare     
    package {'nodejs':
        ensure => latest,
        require => Class['prepare'],
    }
     
    $packages = ['grunt-cli',
                 'bower']
    package {$packages:
        ensure   => present,
        provider => 'npm',
        require  => Package['nodejs'],
    }
}
