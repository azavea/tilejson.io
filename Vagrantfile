# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.8"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.synced_folder "~/.aws", "/home/vagrant/.aws"

  config.vm.provider :virtualbox do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  # Civic Apps Port Mappings
  # Uncomment those you need, delete those you don't
  # Remove this comment when done

  # Nginx
  # config.vm.network :forwarded_port, guest: 9100, host: 9100

  # Gunicorn
  # config.vm.network :forwarded_port, guest: 8080, host: 8080

  # Django debug server
  # config.vm.network :forwarded_port, guest: 8081, host: 8081

  # Webpack Dev Server
  config.vm.network :forwarded_port, guest: 4567, host: 4567

  # Geoprocessing
  # config.vm.network :forwarded_port, guest: 8090, host: 8090

  # Change working directory to /vagrant upon session start.
  config.vm.provision "shell", inline: <<SCRIPT
    if ! grep -q "cd /vagrant" "/home/vagrant/.bashrc"; then
      echo "cd /vagrant" >> "/home/vagrant/.bashrc"
    fi
SCRIPT

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "deployment/ansible/tilejson.io.yml"
    ansible.galaxy_role_file = "deployment/ansible/roles.yml"
  end
end
