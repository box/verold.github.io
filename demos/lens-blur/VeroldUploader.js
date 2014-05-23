(function() {

  'use strict';
  zip.useWebWorkers = false;
  //zip.workerScriptsPath = "http://www.clicktorelease.com/code/depth-player/js/zip/";

  var settings = {
    smoothRadius: 10,
    quadSize: 4,
    pointSize: 3,
    veroldAPIKey: ''
  };

  function setLoadingText(text){
    loading.querySelector('p').textContent=text;
  }

  function setProgress(p){
    loading.querySelector('#progress').style.width=(loading.clientWidth*p)+'px';
  }

  function showLoading(show){
    setProgress(0);

    if(show)
      loading.style.opacity=1;
    else
      loading.style.opacity=0;
  }

  function showMessage(msg){
    message.querySelector('p').innerHTML=msg;
    message.style.opacity=1;
  }

  //var ui=[].slice.call(document.querySelectorAll('.ui'));
  //var container=document.getElementById('container');
  //var loading=document.getElementById('loading');
  //var message=document.getElementById('message');

  /*message.querySelector('a').addEventListener('click',function(e){
    message.style.opacity=0;
  });*/

  var d = new DepthReader();
  var imgSrc = new Image();

  window.addEventListener('load',init);

  function init() {
    console.log('initializing...');
    var displacement=0,nDisplacement=displacement;

    function setImg(){
      imgSrc.src='data:'+d.image.mime+';base64,'+d.image.data;
      //showLoading(false);
    }

    function onError(msg){
      //showLoading(false);
      //showMessage(msg);
    }

    function handleFileSelect(evt) {
      //setLoadingText('Loading...');
      //showLoading(true);

      console.log(evt);
      var file = evt.target.files[0];

      if(!file.type.match('image.*')) {
        //showMessage('Verold upload error: <span class="error">Please select an image file</span>');
      }

      var reader = new FileReader();

      reader.onload = function(theFile){
        d.parseFile(reader.result, setImg, onError);

        $('#browse-view').hide("slide", { direction: "left" }, 500);
        setTimeout( '$("#upload-view").show("slide", { direction: "right" }, 500);' , 200 );
      };

      reader.readAsArrayBuffer(file);
    }

    function exportToVerold(zip) {
      var server = 'http://studio.verold.com';

      var imgColor = new Image();
      imgColor.src = 'data:' + d.image.mime + ';base64,' + d.image.data;

      var createProjectRequest = new XMLHttpRequest();
      var jobRequest = new XMLHttpRequest();
      var assetRequest = new XMLHttpRequest();
      var uploadMaterialRequest = new XMLHttpRequest();
      var uploadPlaneMeshRequest = new XMLHttpRequest();
      var uploadPlaneModelRequest = new XMLHttpRequest();
      var updateMeshRequest = new XMLHttpRequest();
      var createInstanceRequest = new XMLHttpRequest();
      var addToSceneRequest = new XMLHttpRequest();

      var refreshIntervalId;
      var material;
      var mesh;
      var scene;
      var retry = true;

      var finish = function() {
        var res = JSON.parse(addToSceneRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          //var projectId = res.projectId;

          $('#loading').hide();
          $('#upload-view').hide("slide", { direction: "left" }, 500);
          setTimeout( '$("#upload-more-view").show("slide", { direction: "right" }, 500);' , 200 );
          //showMessage('Upload success: <a href="'+ displayUrl +'" target="_blank">See it here</a>');

          //showLoading(false);
        }
      };

      var addToScene = function() {
        var res = JSON.parse(createInstanceRequest.response);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          var entityId = scene.id;

          var children = scene.children;
          children[res.id] = true;

          scene.children = children;
          scene.payload.environment.groundPlaneOn = false;

          var sceneData = JSON.stringify(scene);

          addToSceneRequest.addEventListener('load', finish, true);
          addToSceneRequest.open('PUT', server + '/entities/' + entityId + '.json?api_key=' + settings.veroldAPIKey);
          addToSceneRequest.setRequestHeader('Content-Type', 'application/json');
          addToSceneRequest.send(sceneData);
        }
      };

      var createInstance = function() {
        var res = JSON.parse(updateMeshRequest.response);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          var entityId = res.parentId;

          var instanceJSON = {
            api_key: settings.veroldAPIKey,
            parentAssetId: scene.id
          };

          var instanceData = JSON.stringify(instanceJSON);

          createInstanceRequest.addEventListener('load', addToScene, true);
          createInstanceRequest.open('POST', server + '/entities/' + entityId + '/instances.json');
          createInstanceRequest.setRequestHeader('Content-Type', 'application/json');
          createInstanceRequest.send(instanceData);
        }
      };

      var updateMeshProperties = function() {
        var res = JSON.parse(uploadPlaneModelRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          var modelId = res.id;
          var entityId = mesh.id;

          mesh.parentAssetId = modelId;
          mesh.parentId = modelId;

          var meshData = JSON.stringify(mesh);

          updateMeshRequest.addEventListener('load', createInstance, true);
          updateMeshRequest.open('PUT', server + '/entities/' + entityId + '.json?api_key=' + settings.veroldAPIKey);
          updateMeshRequest.setRequestHeader('Content-Type', 'application/json');
          updateMeshRequest.send(meshData);
        }
      };

      var uploadPlaneModel = function() {
        var res = JSON.parse(uploadPlaneMeshRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          mesh = res;
          var projectId = res.projectId;
          var meshId = res.id;
          var parentFolderId = res.parentFolderId;
          var children = {};
          children[meshId] = true;

          var modelJSON = {
            api_key: settings.veroldAPIKey,
            name: 'Lens Blur Plane',
            type: 'model',
            isPrimitive: true,
            parentFolderId: parentFolderId,
            children: children,
            payload: {
              scale: {x:1, y:1, z:1},
              orientation: {w: 0.7766835761342203, x: 0.6298909608522397, y: 0, z: 0},
              geometry: {}
            }
          };

          var planeModelData = JSON.stringify(modelJSON);

          uploadPlaneModelRequest.addEventListener('load', updateMeshProperties, true);
          uploadPlaneModelRequest.open('POST', server + '/projects/' + projectId + '/entities.json');
          uploadPlaneModelRequest.setRequestHeader('Content-Type', 'application/json');
          uploadPlaneModelRequest.send(planeModelData);
        }
      };

      var uploadPlaneMesh = function() {
        var res = JSON.parse(uploadMaterialRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          material = res;
          var projectId = res.projectId;
          var materialId = res.id;
          var parentFolderId = res.parentFolderId;

          var scaleY = imgColor.height/imgColor.width;
          var segmentsX = Math.round(imgColor.width/24);
          var segmentsY = Math.round(imgColor.height/24);
          var bbY = scaleY/2;

          var meshJSON = {
            api_key: settings.veroldAPIKey,
            name: 'Lens Blur Plane Mesh',
            type: 'mesh',
            isPrimitive: true,
            parentFolderId: parentFolderId,
            payload: {
              material: materialId,
              scale: {x:1, y:1, z:1},
              geometry: {
                type: 'Plane',
                scale: {x:1, y:scaleY},
                segmentsX: segmentsX,
                segmentsY: segmentsY
              },
              boundingbox: {
                min: {x: -0.5, y: -bbY, z:-0.5},
                max: {x: 0.5, y: bbY, z: 0.5}
              }
            }
          };

          var planeMeshData = JSON.stringify(meshJSON);

          uploadPlaneMeshRequest.addEventListener('load', uploadPlaneModel, true);
          uploadPlaneMeshRequest.open('POST', server + '/projects/' + projectId + '/entities.json');
          uploadPlaneMeshRequest.setRequestHeader('Content-Type', 'application/json');
          uploadPlaneMeshRequest.send(planeMeshData);
        }
      };

      var uploadMaterial = function() {
        var res = JSON.parse(assetRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          var projectId;
          var diffuseTexture;
          var displacementTexture;
          var parentFolderId;

          for(var i in res) {
            var asset = res[i];
            if(asset.type === 'texture2D') {
              parentFolderId = asset.parentFolderId;
              projectId = asset.projectId;

              if(asset.name === 'diffuse') {
                diffuseTexture = asset.id;
              } else if(asset.name === 'displacement') {
                displacementTexture = asset.id;
              }
            } else if(asset.type === 'scene') {
              scene = asset;
            }
          }

          var materialJSON = {
            'api_key': settings.veroldAPIKey,
            'name': 'Lens Blur Material',
            'type': 'material',
            'parentFolderId': parentFolderId,
            'payload': {
              materialType: 'Standard',
              displacementMag: -1,
              diffuseTexture: diffuseTexture,
              displacementTexture: displacementTexture,
              Features: {
                'Displacement': {
                  enabled: true,
                  SubFeatures: {
                    'Displacement Texture': { enabled: true }
                  }
                },

                'Diffuse Color': {
                  enabled: true,
                  SubFeatures: {
                    'AO Texture': { enabled: false },
                    'Diffuse Texture': { enabled: true }
                  }
                }
              }
            }
          };

          var materialData = JSON.stringify(materialJSON);

          uploadMaterialRequest.addEventListener('load', uploadPlaneMesh, true);
          uploadMaterialRequest.open('POST', server + '/projects/' + projectId + '/entities.json');
          uploadMaterialRequest.setRequestHeader('Content-Type', 'application/json');
          uploadMaterialRequest.send(materialData);
        }
      };

      var getProjectAssets = function(projectId) {
        assetRequest.addEventListener('load', uploadMaterial, true);
        assetRequest.open('GET', server + '/projects/' + projectId + '/assets.json');
        assetRequest.responseType = '';
        assetRequest.send();
      };

      var onJobCompletion = function() {
        var res = JSON.parse(jobRequest.responseText);
        var job;
        if(res.length) {
          job = res[0];
        } else {
          job = res;
        }

        var projectId = job.projectId;
        var jobId = job.id;

        if(job.progress === 100) {
          if(refreshIntervalId) {
            clearInterval(refreshIntervalId);
            refreshIntervalId = undefined;
          }

          getProjectAssets(projectId);
        } else {
          if(retry) {
            refreshIntervalId = setInterval(function() {
              jobRequest.open('GET', server + '/projects/' + projectId + '/jobs/' + jobId + '.json?api_key=' + settings.veroldAPIKey);
              jobRequest.responseType = '';
              jobRequest.send();
            }, 1000);

            retry = false;
          }
        }
      };

      var getProjectJobs = function() {
        var res = JSON.parse(createProjectRequest.responseText);

        if(res.errors) {
          //showMessage('Verold upload error: <span class="error">'+res.errors[0]+'</span>');
          //showLoading(false);
        } else {
          var projectId = res.id;

          jobRequest.addEventListener('load', onJobCompletion, true);
          jobRequest.open('GET', server + '/projects/' + projectId + '/jobs.json');
          jobRequest.responseType = '';
          jobRequest.send();
        }
      };

      var formData = new FormData();
      formData.append('api_key', settings.veroldAPIKey);
      formData.append('model', zip);
      formData.append('filename', 'lensBlur.zip');
      formData.append('title', 'My Lens Blur Project');
      formData.append('description', 'image via\nhttp://www.clicktorelease.com/code/depth-player/');
      formData.append('tags', 'lens blur,android');
      formData.append('allowApi', 'allowApi');
      formData.append('privacy', 'public');

      createProjectRequest.addEventListener('load', getProjectJobs, true);
      createProjectRequest.open('POST', server + '/projects.json', true);
      createProjectRequest.send(formData);
    }

    function b64toBlob(b64Data,contentType,sliceSize){
      contentType=contentType||'';
      sliceSize=sliceSize||512;

      var byteCharacters=atob(b64Data);
      var byteArrays=[];

      for(var offset=0;offset<byteCharacters.length;offset+=sliceSize){
        var slice=byteCharacters.slice(offset,offset+sliceSize);
        var byteNumbers=new Array(slice.length);

        for(var i=0;i<slice.length;i++){
          byteNumbers[i]=slice.charCodeAt(i);
        }

        var byteArray=new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays,{type:contentType});

      return blob;
    }

    document.getElementById('uploadFile').addEventListener('change', handleFileSelect, false);

    document.getElementById('submitApi').addEventListener('click', function(e) {
      e.preventDefault();

      var charcount = $("#veroldAPIKey").val().length;
      if (charcount!=32) {
        $('#invalidApi').show();
        $('.api-form').effect('shake');
      }else{
        settings.veroldAPIKey = $("#veroldAPIKey").val();
        $('#invalidApi').hide();
        $('#api-view').hide("slide", { direction: "left" }, 500);
        setTimeout( '$("#browse-view").show("slide", { direction: "right" }, 500);' , 200 );
      }
    });

    document.getElementById('uploadVerold').addEventListener('click', function(e) {
      $('#loading').show();
      if(settings.veroldAPIKey === '') {
        //showMessage('Please enter you <b>Verold</b> API key on the <b>Settings</b>');
        return;
      }

      //setLoadingText('Exporting...');
      //showLoading(true);

      var blobColorImage = b64toBlob(d.image.data, d.image.mime);
      var blobDepthImage = b64toBlob(d.depth.data, d.depth.mime);
      var zipWriter;

      zip.createWriter(new zip.BlobWriter('application/zip'), function(writer) {
        zipWriter = writer;

        zipWriter.add('diffuse.jpg', new zip.BlobReader(blobColorImage), function() {
          zipWriter.add('displacement.jpg', new zip.BlobReader(blobDepthImage), function() {
            zipWriter.close(function(textures){
              textures.name = 'lensBlur.zip';
              textures.url = URL.createObjectURL(textures);
              exportToVerold(textures);
            });
          });
        });
      });

      e.preventDefault();
    });
  }
})();
