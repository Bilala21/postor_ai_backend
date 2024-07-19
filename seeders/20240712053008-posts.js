'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const posts = [];
    const titles = [
      'First Post', 'Second Post', 'Third Post', 'Fourth Post', 'Fifth Post',
      'Sixth Post', 'Seventh Post', 'Eighth Post', 'Ninth Post', 'Tenth Post'
    ];
    const descriptions = [
      'This is the first post description.', 'This is the second post description.', 'This is the third post description.',
      'This is the fourth post description.', 'This is the fifth post description.', 'This is the sixth post description.',
      'This is the seventh post description.', 'This is the eighth post description.', 'This is the ninth post description.',
      'This is the tenth post description.'
    ];
    const hashtags = [
      '#first,#post,#example', '#second,#post,#example', '#third,#post,#example', '#fourth,#post,#example', '#fifth,#post,#example',
      '#sixth,#post,#example', '#seventh,#post,#example', '#eighth,#post,#example', '#ninth,#post,#example', '#tenth,#post,#example'
    ];
    const platforms = [
      'Facebook,Twitter', 'Instagram,LinkedIn', 'Facebook,Twitter', 'Instagram,LinkedIn', 'Facebook,Twitter',
      'Instagram,LinkedIn', 'Facebook,Twitter', 'Instagram,LinkedIn', 'Facebook,Twitter', 'Instagram,LinkedIn'
    ];

    for (let i = 0; i < 10; i++) {
      posts.push({
        user_id:1,
        title: titles[i],
        desc: descriptions[i],
        hashtags: hashtags[i],
        platforms: platforms[i],
        scheduled_at: new Date(),
        meridian: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return queryInterface.bulkInsert('Posts', posts, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {});
  }
};
