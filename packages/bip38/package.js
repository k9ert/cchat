Npm.depends({
      'bip38': '0.0.1' 
});

Package.on_use(function (api) {
      api.add_files('bip38.js', 'server'); // Or 'client', or ['server', 'client']
});