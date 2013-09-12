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
}
