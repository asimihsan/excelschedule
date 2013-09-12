class environment {
    $base_packages = ["htop", "tmux", "dtach", "zsh"]
    case $operatingsystem {
        ubuntu: {
            $packages = ["vim-nox"]
        }
        /(centos|redhat|oel)/: {
            $packages = ["vim-enhanced"]
        }
    }
    package { $base_packages: ensure => installed }
    package { $packages: ensure => installed }

    group { "ubuntu":
      ensure => present,
    }
    exec { "gem install ruby-shadow":
        unless => "gem list | grep -q ruby-shadow",
    }
    user { "ubuntu":
        ensure => present,
        managehome => true,
        password => '$6$.NelsBXsrmasqwem$sm/7ALewNptEJjTwYfUJwpDJo5JPl2lIlH3xo63r1t8qyCWqQJBZNiy/pFVsrwPrVPAwqQ.tdohWOWLtUzmxK1',
        shell => '/bin/zsh',
        groups => ['ubuntu', 'adm', 'sudo'],
        require => [Package['zsh'],
                    Group['ubuntu'],
                    Exec['gem install ruby-shadow']],
    }

    exec { "install_zsh":
        command => 'su - ubuntu -c "curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | bash"',
        creates => "/home/ubuntu/.oh-my-zsh",
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.zshrc":
        source => "/etc/puppet/modules/environment/files/zshrc",
        mode => 644,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.zshenv":
        source => "/etc/puppet/modules/environment/files/zshenv",
        mode => 644,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.oh-my-zsh/themes/bira-date.zsh-theme":
        source => "/etc/puppet/modules/environment/files/bira-date.zsh-theme",
        mode => 644,
        require => Exec["install_zsh"],
    }
    file { "/home/ubuntu/.config":
        ensure => directory,
        require => User["ubuntu"],
    }    
    file { "/home/ubuntu/.config/htop":
        ensure => directory,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.config/htop/htoprc":
        source => "/etc/puppet/modules/environment/files/htoprc",
        mode => 644,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.ssh":
        ensure => "directory",
        mode => 700,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.bashrc":
        source => "/etc/puppet/modules/environment/files/bashrc",
        mode => 644,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.ssh/known_hosts":
        source => "/etc/puppet/modules/environment/files/known_hosts",
        mode => 644,
        require => User["ubuntu"],
    }
    file { "/home/ubuntu/.ssh/config":
        source => "/etc/puppet/modules/environment/files/ssh_config",
        mode => 644,
        require => User["ubuntu"],
    }
}
