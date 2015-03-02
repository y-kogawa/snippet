module.exports = function(grunt){
	ftpSettings = ({
		auth: {
			host: '',
			port: 21,
			authKey: 'key1'
		},
		src: 'httpdocs',
		dest: '/httpdocs/',
		exclusions: ['**/.*', '**/*.*', '*.*', '.*']
	});

	grunt.initConfig({
		connect: {
			site: {}
		},

		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},

		csscomb: {
			dev: {
				expand: true,
				src: 'httpdocs/css/**/*.css',
				// cwd: 'httpdocs/build/',
				// src: ['*.css'],
				// dest: 'httpdocs/css/',
			}
		},

		csspretty: {
			dist: {
				options: {
					decl: {
						before: '\n	',
						between: ': '
					},
					rule: {
						before: '\n\n',
						between: ' ',
						after: '\n',
					},
					atRule: {
						indent: '	',
					},
					selectors: 'sameline',
				},
				src: 'httpdocs/css/**/*.css',
			},
		},

		watch: {
			local: {
				files: ['httpdocs/**/*.css', 'httpdocs/**/*.html', 'httpdocs/**/*.php'],
			},
			sass: {
				files: ['httpdocs/**/*.scss'],
				tasks: ['compass', 'csscomb', 'csspretty'],
            },
			options: {
				nospawn: true,
				livereload: true,
			}
		},

		ftp: {
			files: ['httpdocs/**/*.css', 'httpdocs/**/*.html', 'httpdocs/**/*.php'],
			tasks: ['compass', 'ftp-deploy:changed']
		},

		'ftp-deploy': {}
	});

	grunt.registerTask('f', ['ftp']);
	grunt.registerTask('default', ['watch']);

	grunt.event.on("watch", function(action, filepath) {
		if (action !== 'changed') {
			return;
		}
		var exclusions, target;
		target = '!' + filepath;
		exclusions = ftpSettings.exclusions.concat();
		exclusions.push(target);
		console.log(exclusions);
		return grunt.config.set('ftp-deploy', {
			changed: {
				auth: ftpSettings.auth,
				src: ftpSettings.src,
				dest: ftpSettings.dest,
				exclusions: exclusions
			}
		});
	});

	// grunt.loadNpmTasks("grunt-ftp-deploy");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-csspretty');
}
