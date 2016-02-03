_.extend( Notifications, {
	create: function ( userId, content, type ) {
		notifications.insert({
			userId   : userId,
			type     : ( type ) ? type : 'info',
			content  : content,
			createdAt: new Date()
		});
	},

	markAsRead: function ( notificationId ) {
		notifications.update( notificationId, {
			$set: {
				readAt: new Date()
			}
		});
	}
});

Meteor.methods({
	'Notifications.markAsRead': function ( notificationId ) {
		Notifications.markAsRead( notificationId );
	}
});
