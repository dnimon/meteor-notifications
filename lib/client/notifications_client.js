var helpers = {
		notifications: {
			title: function () {
				return APP_PREFIX;
			},

			notifications: function () {
				return notifications.find({
					userId: Meteor.userId()
				},
				{sort: {createdAt: -1}}
			);
			},

			notificationCount: function () {
				return notifications.find({
					userId: Meteor.userId()
				}).count();
			},
			unreadNotificationCount: function () {
				return notifications.find({
					userId: Meteor.userId(),
					readAt: {
						$exists: false
					}
				}).count();
			}
	},

		notification: {
			type: function () {
				return this.type;
			},

			title: function () {
				return this.content.title;
			},

			text: function () {
				return this.content.text;
			},
			readAt: function() {
				if(!this.readAt) return false;
				else return this.readAt;
			},
			createdAt: function() {
				return this.createdAt;
			},
			id: function() {
				return this._id;
			}
		}
	};

_.extend( Notifications, {
	markAsRead: function ( notificationId ) {
		Meteor.call( 'Notifications.markAsRead', notificationId );
	}
});

Meteor.startup( function () {
	// Register global template helpers
	Template.registerHelper( APP_PREFIX, function () {
		return helpers.notifications;
	});

	Template.registerHelper( APP_PREFIX + 'Item', function () {
		return helpers.notification;
	});

	// Main Template Helpers & Events Handlers
	if ( Blaze.isTemplate( Template[ APP_PREFIX ] ) ) {

		Template[ APP_PREFIX ].helpers( helpers.notifications );

		// Item Template Helpers & Events Handlers
		if ( Blaze.isTemplate( Template[ APP_PREFIX + 'Item' ] ) ) {

			Template[ APP_PREFIX + 'Item' ].helpers( helpers.notification );

			Template[ APP_PREFIX + 'Item' ].events({
				'click a': function () {
					Notifications.markAsRead( this._id );
				}
			});
		}
	} else if ( Notifications._options.showHandler ) {
		// If custom handler defined, show as single (customizable) notification
		// To prevent this, just set showHandler to null
		Tracker.autorun( function () {
			var unreadNotifications = _.map(
				helpers.notifications.notifications().fetch(), function ( notification ) {
					return notification;
				});

			if ( unreadNotifications.length ) {
				_.map( unreadNotifications, function ( notification ) {
					Notifications.show( notification );
				});
			}
		});
	}
});
