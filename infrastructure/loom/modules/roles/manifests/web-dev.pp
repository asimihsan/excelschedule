class roles::web-dev {
    Exec {
        path => "/home/ubuntu/.pyenv/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin",
        logoutput => "on_failure",
    }
    File {
        owner => "ubuntu",
        group => "ubuntu",
        mode => 600,
    }
    include development_tools
    include python
    include environment
    include openssl
    include excelschedule
    include nginx
    include nodejs
}
