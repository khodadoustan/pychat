import hashlib
import threading
from os.path import join

from django import template
from django.conf import settings

from settings import STATIC_URL
import base64

register = template.Library()


class UrlCache(object):
	_md5_sum = {}
	_counter_lock = threading.Lock()

	@classmethod
	def get_md5(cls, file):
		try:
			return cls._md5_sum[file]
		except KeyError:
			with cls._counter_lock:
				md5 = base64.urlsafe_b64encode(cls.calc_md5(file))
				value = '%s%s?v=%s' % (STATIC_URL, file, md5.decode('utf-8'))
				cls._md5_sum[file] = value
				return value

	@classmethod
	def calc_md5(cls, file):
		full_path = join(settings.STATIC_ROOT, file)
		with open(full_path, 'rb') as fh:
			m = hashlib.md5()
			while True:
				data = fh.read(8192)
				if not data:
					break
				m.update(data)
			return m.digest()


@register.simple_tag
def md5url(model_object):
	return UrlCache.get_md5(model_object)