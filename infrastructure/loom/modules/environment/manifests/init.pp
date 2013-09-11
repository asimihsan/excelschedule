class environment {
    File {
        owner => "ubuntu",
        group => "ubuntu",
        mode => 600,
    }
    user { "ubuntu":
      ensure => present,
    }
    group { "ubuntu":
      ensure => present,
    }
    file { "/home/ubuntu/.ssh":
        ensure => "directory",
    }
    file { "/home/ubuntu/.ssh/known_hosts":
        source => "/environment/files/known_hosts",
    }
    file { "/home/ubuntu/.ssh/config":
        source => "/environment/files/ssh_config",
    }
}
