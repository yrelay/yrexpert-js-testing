/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

var build = require('./build');
var sessions = require('ewd-session');
var beatryxRobot = require('./beatryxRobot');
var runRPC = require('yrexpert-rpc/lib/proto/runRPC');
var fs = require('fs');
var os = require('os');

/**
 * Module yrexpert-js.
 * @module lib/yrexpert-js
 */

/** Fonction yrexpert-js. */
module.exports = {

  /** Initialisation. */
  init: function() {
    var types = [
      'qoper8-stats',
      'qoper8-getStats',
      'getMasterProcessDetails',
      'getWorkerDetails',
      'getPoolSize'
    ];
    if (this.dontLog) this.dontLog(types);
  },

  /** Services autorisés. */
  servicesAllowed: {
    'ewd-react-tools': true
  },

  /** Gestionnaire d'évènemments. */
  handlers: {

    /**
     * Exécuter le RPC [RPCUSR ETABLIR CONNEXION].
     * @constructor
     * @param {object} messageObj - Message : [ac, vc].
     * @param {number} session - Session.
     * @param {string} send - Send.
     * @param {object} finished - Message de retour de la fonction.
     */
    loginRpc: function(messageObj, session, send, finished) {

      if (session.authenticated) {
        finished({error: 'Vous êtes déjà connectés à yrexpert-js'});
        return;
      }

      var accessCode = messageObj.params.ac;
      var verifyCode = messageObj.params.vc;
      //console.log("-----messageObj.params.ac: " + JSON.stringify(messageObj.params.ac));
      //console.log("-----messageObj.params.vc: " + JSON.stringify(messageObj.params.vc));

      if (accessCode === '') {
        finished({error: "Vous devez entrer un code d'accès"});
        return;
      }
      if (verifyCode === '') {
        finished({error: 'Vous devez saisir un code de validation'});
        return;
      }

      if (!this.db.symbolTable) this.db.symbolTable = sessions.symbolTable(this.db);

      var params = {
        rpcName: 'RPCUSR ETABLIR CONNEXION'
      };

      // N'enregistrez pas encore la table des symboles!
      var response = runRPC.call(this, params, session, false);
      //console.log("-----response: " + JSON.stringify(response));
  
      params = {
        rpcName: 'RPCUSR VERIFIER CODE',
        rpcArgs: [{
          type: 'LITERAL',
          value: accessCode + ';' + verifyCode
        }]
      };

      var response = runRPC.call(this, params, session, false);
      console.log('login response: ' + JSON.stringify(response));
      var values = response.value;
      var duz = values[0];
      var err = values[3];
      //console.log("-----err: " + JSON.stringify(err));
      if (duz.toString() === '0' && err !== '') {
        finished({error: err});
      }
      else {
        // Connecté avec succès
        // Enregistrer la table des symboles à la session ...
        ok = this.db.symbolTable.save(session);

        // Nettoyer le processus de back-end Cache / GT.M:
        ok = this.db.symbolTable.clear();

        // ** important ! Signaler l'utilisateur comme authentifié pour empêcher l'accès non autorisé aux RPC par un utilisateur avant de se connecter
        session.authenticated = true;

        // Réponse de retour
        var greeting = values[7];
        var pieces = greeting.split(' ');
        pieces = pieces.splice(2, pieces.length);
        var displayName = pieces.join(' ');

        var results = {
          displayName: displayName,
          greeting: greeting,
          lastSignon: values[8],
          messages: values.splice(8, values.length)
        };
        // Notez que nous ne renvoyons pas le DUZ!
        //finished(results);
        session.timeout = 20 * 60;
        session.authenticated = true;
        finished({ok: true});    
      }
    },

    getToken: function(messageObj, session, send, finished) {
      //console.log("-----getToken: " + JSON.stringify(messageObj));
      finished(messageObj);    
    },

    /**
     * Exécuter le RPC [RPCBDD EXECUTER COMMANDE SET].
     * @constructor
     * @param {object} messageObj - Message : [qui, rep, ind, att, val, ice].
     * @param {number} session - Session.
     * @param {string} send - Send.
     * @param {object} finished - Message de retour de la fonction.
     */
    setRPCBDDC: function(messageObj, session, send, finished) {

      var partition = messageObj.params.qui;
      var repertoire = messageObj.params.rep;
      var individu = messageObj.params.ind;
      var attribut = messageObj.params.att;
      var valeur = messageObj.params.val;
      var indice = messageObj.params.ice;
      //console.log("-----messageObj.params.qui: " + JSON.stringify(messageObj.params.qui));
      //console.log("-----messageObj.params.rep: " + JSON.stringify(messageObj.params.rep));

      if (partition === '') {
        finished({error: "Vous devez indiquer le nom d'une base de données (partition utilisateur)"});
        return;
      }
      if (repertoire === '') {
        finished({error: "Vous devez indiquer le non d'un répertoire (repertoire)"});
        return;
      }
      if (individu === '') {
        finished({error: "Vous devez indiquer le nom d'un individu (individu)"});
        return;
      }
      if (attribut === '') {
        finished({error: "Vous devez indiquer le nom d'un attribut (attribut)"});
        return;
      }
      if (valeur === '') {
        finished({error: "Vous devez indiquer une valeur pour l'attribut (valeur)"});
        return;
      }
      if (indice === '') {
        finished({error: "Vous devez indiquer un indice pour l'attribut (indice)"});
        return;
      }

      if (!this.db.symbolTable) this.db.symbolTable = sessions.symbolTable(this.db);

      params = {
        rpcName: 'RPCBDD EXECUTER COMMANDE SET',
        rpcArgs: [
          {type: 'LITERAL', value: partition}, 
          {type: 'LITERAL', value: repertoire}, 
          {type: 'LITERAL', value: individu}, 
          {type: 'LITERAL', value: attribut}, 
          {type: 'LITERAL', value: valeur}, 
          {type: 'LITERAL', value: indice} 
        ],
      };

      var response = runRPC.call(this, params, session, false);
      var value = response.value;
      //console.log("-----value: " + JSON.stringify(value));
      if (value !== 1) {
        finished({error: value});
      }
      else {
        // Attribut mofifié avec succès
        // Enregistrer la table des symboles à la session ...
        ok = this.db.symbolTable.save(session);

        // Nettoyer le processus de back-end Cache / GT.M:
        ok = this.db.symbolTable.clear();

        // Réponse de retour
        var message = value;

        var results = {
          message: message
        };
        finished({ok: true});    
      }
    },

    /**
     * Exécuter le RPC [RPCBDD EXECUTER COMMANDE READ].
     * @constructor
     * @param {object} messageObj - Message : [qui, rep, ind, att, ice].
     * @param {number} session - Session.
     * @param {string} send - Send.
     * @param {object} finished - Message de retour de la fonction.
     */
    readRPCBDDC: function(messageObj, session, send, finished) {

      var partition = messageObj.params.qui;
      var repertoire = messageObj.params.rep;
      var individu = messageObj.params.ind;
      var attribut = messageObj.params.att;
      var indice = messageObj.params.ice;
      //console.log("-----messageObj.params.qui: " + JSON.stringify(messageObj.params.qui));
      //console.log("-----messageObj.params.rep: " + JSON.stringify(messageObj.params.rep));

      if (partition === '') {
        finished({error: "Vous devez indiquer le nom d'une base de données (partition utilisateur)"});
        return;
      }
      if (repertoire === '') {
        finished({error: "Vous devez indiquer le non d'un répertoire (repertoire)"});
        return;
      }
      if (individu === '') {
        finished({error: "Vous devez indiquer le nom d'un individu (individu)"});
        return;
      }
      if (attribut === '') {
        finished({error: "Vous devez indiquer le nom d'un attribut (attribut)"});
        return;
      }
      if (indice === '') {
        finished({error: "Vous devez indiquer un indice pour l'attribut (indice)"});
        return;
      }

      if (!this.db.symbolTable) this.db.symbolTable = sessions.symbolTable(this.db);

      params = {
        rpcName: 'RPCBDD EXECUTER COMMANDE READ',
        rpcArgs: [
          {type: 'LITERAL', value: partition}, 
          {type: 'LITERAL', value: repertoire}, 
          {type: 'LITERAL', value: individu}, 
          {type: 'LITERAL', value: attribut}, 
          {type: 'LITERAL', value: indice} 
        ],
      };

      var response = runRPC.call(this, params, session, false);
      console.log("-----response: " + JSON.stringify(response));

      if (response.value === undefined) {
        finished({error: "Aucune valeur trouvée pour " + partition + " " + repertoire + " " + individu + " " + attribut + " " + indice});
      }
      else {
        // Attribut mofifié avec succès
        // Enregistrer la table des symboles à la session ...
        ok = this.db.symbolTable.save(session);

        // Nettoyer le processus de back-end Cache / GT.M:
        ok = this.db.symbolTable.clear();

        // Réponse de retour
        finished({value: response.value});    
      }
    },

    /**
     * Se déplacer sur une partition.
     * @constructor
     * @param {object} messageObj - Message.
     * @param {number} session - Session.
     * @param {string} send - Send.
     * @param {object} finished - Message de retour de la fonction.
     */
    cdNameSpace: function(messageObj, session, send, finished) {
      var fn = {};
      var path = '/home/' + process.env['instance'] + '/partitions/' + messageObj.params.namespace.toLowerCase() + '/globals/';
      if (messageObj.params.namespace != '') {
        if (fs.existsSync(path + messageObj.params.namespace.toUpperCase() + '.gld')) {
          var fn = this.db.function({function: 'ZGBLDIR^%GTM', arguments: [messageObj.params.namespace.toUpperCase()]});
        }
      }
      finished(fn);    
    },

    /**
     * Obtenir la liste des noms des partitions installées.
     * @constructor
     * @param {object} messageObj - Message.
     * @param {number} session - Session.
     * @param {string} send - Send.
     * @param {object} finished - Liste des noms des partitions installées sous la forme ["DMO", "YXP"].
     */
    getNameSpace: function(messageObj, session, send, finished) {
      var path = '/home/' + process.env['instance'] + '/partitions/';
      fs.readdir(path, function(err, items) {
        if (err) {
          finished(err);
        }
        finished(items);
      });
    },

    getQui: function(messageObj, session, send, finished) {
      var node = {
        global: 'QUI',
        subscripts: []
      };
      var result = this.db.get(node);
      //console.log("-----getQui: " + JSON.stringify(result));
      finished({qui: result.data});
    },

    setQui: function(messageObj, session, send, finished) {
      if (messageObj.params.partition && messageObj.params.partition !== '') {
        var node = {
          global: 'QUI',
          subscripts: [],
          data: messageObj.params.partition
        };
        var result = this.db.set(node);
        //console.log("-----setQui: " + JSON.stringify(result.data));
        finished({ok: true});    
      }
      else {
        finished({error: 'Partition non valide'});
      }
    },

    /* A supprimer */
    login: function(messageObj, session, send, finished) {

      if (messageObj.params.password === this.userDefined.config.managementPassword) {
        session.timeout = 20 * 60;
        session.authenticated = true;
        finished({ok: true});    
      }
      else {
        finished({error: 'Invalid login attempt'});
      }
      return;
    },

    getServerName: function(messageObj, session, send, finished) {
      var serverName = '';
      if (this.userDefined.config && this.userDefined.config.serverName) serverName = this.userDefined.config.serverName;
      finished({serverName: serverName});
    },

    getBuildDetails: function(messageObj, session, send, finished) {
      var node = {
        global: 'INCONNE',
        subscripts: ['VERSION']
      };
      var rep = this.db.get(node);
      if (session.authenticated) {
        var buildDetails = {
          nodejsBuild: process.version,
          dbInterface: this.db.version(),
          qoper8Build: this.build,
          docStoreBuild: this.documentStore.build,
          xpressBuild: this.xpress.build,
          yrexpertmVersion: rep.data,
          yrexpertjsBuild: build
        };
        //console.log("-----buildDetails: " + JSON.stringify(buildDetails));
        if (this.userDefined.config && this.userDefined.config.qxBuild) buildDetails.qxBuild = this.userDefined.config.qxBuild;
        finished(buildDetails);
      }
      else {
        finished({error: 'Non authentifié'});
      }
    },

    getMasterProcessDetails: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        //var details = {};
        //if (this.userDefined.config && this.userDefined.config.masterProcessPid) details.pid = this.userDefined.config.masterProcessPid;
        //finished(details);
        finished({ok: true});
      }
      else {
        finished({error: 'Non authentifié'});
      }
    },

    stopMasterProcess: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        send({displayButton: true});
        finished({closeSocket: true});
      }
      else {
        finished({error: 'Non authentifié'});
      }
    },

    getWorkerDetails: function(messageObj, session, send, finished) {
      if (session.authenticated) {
        finished({ok: true});
      }
      else {
        finished({error: 'Non authentifié'});
      }
    },

    stopWorkerProcess: function(messageObj, session, send, finished) {
      finished({pid: messageObj.params.pid});
    },

    setPoolSize: function(messageObj, session, send, finished) {
      finished({poolSize: messageObj.params.poolSize});
    },

    getPoolSize: function(messageObj, session, send, finished) {
      finished({ok: true});
    },

    getGlobalDirectory: function(messageObj, session, send, finished) {
      var dir = this.db.global_directory();
      finished(dir);
    },

    getNextSubscripts: function(messageObj, session, send, finished) {
      var subscripts = messageObj.params.path.split('.');
      var global = subscripts.shift();
      var glo = new this.documentStore.DocumentNode(global, subscripts);
      var data = {};
      glo.forEachChild(function(name, node) {
        if (node.hasChildren) {
          data[name] = messageObj.params.expandText
	 }
	 else data[name] = node.value;
      });
      finished(data);
    },

    getSessions: function(messageObj, session, send, finished) {
      var activeSessions = this.sessions.active();
      var sessions = [];
      var disabled;
      activeSessions.forEach(function(ewdSession) {
        disabled = false;
        if (ewdSession.id.toString() === session.id.toString()) disabled = true;
        sessions.push({
          id: ewdSession.id,
          token: ewdSession.token,
          application: ewdSession.application,
          expiry: ewdSession.expiryTime,
          disabled: disabled
        });
      });
      finished(sessions);
    },

    stopSession: function(messageObj, session, send, finished) {
      var ewdSession = this.sessions.byToken(messageObj.params.token);
      if (ewdSession) ewdSession.delete();
      finished({ok: true});
    },

    showSession: function(messageObj, session, send, finished) {
      var token = messageObj.params.token;
      var ewdSession = this.sessions.byToken(token);
      if (ewdSession) {
        var data = {};
        var expandText = ' -->';
        ewdSession.data.forEachChild(function(name, childNode) {
          data[name] = expandText;
          if (childNode.hasValue) data[name] = childNode.value;
          if (name === 'ewd_symbolTable') data[name] = 'Données de table de symboles mumps';
        });
        finished({
          token: token,
          id: ewdSession.id,
          data: data
        });
      }
      else {
        finished({
          token: token,
          error: 'La session n existe plus'
        });
      }
    },

    getSessionSubscripts: function(messageObj, session, send, finished) {
      var subs = messageObj.params.path.split('.');
      var token = messageObj.params.token;
      var ewdSession = this.sessions.byToken(token);
      if (ewdSession) {
        var documentName = ewdSession.documentName;
        var subscripts = ewdSession.data._node.subscripts.concat(subs);
        var doc = new this.documentStore.DocumentNode(documentName, subscripts);
        var data = {};
        doc.forEachChild(function(name, childNode) {
          data[name] = messageObj.params.expandText;
          if (childNode.hasValue) data[name] = childNode.value;
        });
        finished({
          data: data
        });
      }
      else {
        finished({error: 'La session n existe plus'});
      }
    },



    getBeatryxRobot: function(messageObj, beatryx, send, finished) {
      console.log("-----this.beatryxRobot: " + JSON.stringify(this.beatryxRobot));
      var beatryxRobot = [];
      beatryxRobot.push({
        id: 123456789,
        token: "ewdSession.token",
        application: "Raison sociale",
        expiry: "31/12/2017",
        disabled: true
      });
      finished(beatryxRobot);
/**
      console.log("-----messageObj: " + JSON.stringify(messageObj));
      console.log("-----beatryx: " + JSON.stringify(beatryx));
      console.log("-----this.beatryxRobot: " + JSON.stringify(this.beatryxRobot));
      console.log("-----this.beatryxRobot.active(): " + JSON.stringify(this.beatryxRobot.active()));
      var activeBeatryxRobot = this.beatryxRobot.active();
      var beatryxRobot = [];
      var disabled;
      activeBeatryxRobot.forEach(function(ewdSession) {
        disabled = false;
        if (ewdSession.id.toString() === session.id.toString()) disabled = true;
        beatryxRobot.push({
          id: ewdSession.id,
          token: ewdSession.token,
          application: ewdSession.application,
          expiry: ewdSession.expiryTime,
          disabled: disabled
        });
      });
      finished(beatryxRobot);
*/
    },

    stopBeatryx: function(messageObj, beatryx, send, finished) {
      var ewdSession = this.beatryxRobot.byToken(messageObj.params.token);
      if (ewdSession) ewdSession.delete();
      finished({ok: true});
    },

    showBeatryx: function(messageObj, beatryx, send, finished) {
      var token = messageObj.params.token;
      var ewdSession = this.beatryxRobot.byToken(token);
      if (ewdSession) {
        var data = {};
        var expandText = ' -->';
        ewdSession.data.forEachChild(function(name, childNode) {
          data[name] = expandText;
          if (childNode.hasValue) data[name] = childNode.value;
          if (name === 'ewd_symbolTable') data[name] = 'Données de table de symboles mumps';
        });
        finished({
          token: token,
          id: ewdSession.id,
          data: data
        });
      }
      else {
        finished({
          token: token,
          error: 'La session n existe plus'
        });
      }
    },

    getBeatryxSubscripts: function(messageObj, beatryx, send, finished) {
      var subs = messageObj.params.path.split('.');
      var token = messageObj.params.token;
      var ewdSession = this.beatryxRobot.byToken(token);
      if (ewdSession) {
        var documentName = ewdSession.documentName;
        var subscripts = ewdSession.data._node.subscripts.concat(subs);
        var doc = new this.documentStore.DocumentNode(documentName, subscripts);
        var data = {};
        doc.forEachChild(function(name, childNode) {
          data[name] = messageObj.params.expandText;
          if (childNode.hasValue) data[name] = childNode.value;
        });
        finished({
          data: data
        });
      }
      else {
        finished({error: 'La session n existe plus'});
      }
    }








  },
  workerResponseHandlers: {
    // Permettre l'interception par le processus maître d'augmenter/traiter la demande après l'authentification dans le worker
    getMasterProcessDetails: function(message) {
      var stats = this.getStats();
      return {
        pid: process.pid,
        startTime: new Date(this.startTime).toLocaleString(),
        upTime: stats.uptime,
        memory: stats.memory
      }
    },

    getWorkerDetails: function(message, send) {
      // utiliser la fonction de gestionnaire spécial pour obtenir des statistiques pour master et les workers
      var that = this;
      this.handleStats(function(messageObj) {
        var resultObj = {
          type: 'getWorkerDetails',
          results: messageObj.worker
        };
        send(resultObj);
      });
      return;
    },

    stopMasterProcess: function(message) {

      if (message.displayButton) return message ;

      // retarder légèrement pour permettre l'envoi de la réponse au navigateur
      var that = this;
      setTimeout(function() {
        that.stop();
      }, 2000);
      //return {disconnect: true, error: 'EWD AppRunner a été arrêté'};
      return {ok: true};
    },

    stopWorkerProcess: function(message) {
      this.stopWorker(message.pid);
      return {pid: message.pid};
    },

    getPoolSize: function(message) {
      return {poolSize: this.worker.poolSize};
    },

    setPoolSize: function(message) {
      this.setWorkerPoolSize(message.poolSize);
      return {ok: true};
    }

  }

};
